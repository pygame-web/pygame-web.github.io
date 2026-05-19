import asyncio
import pygame
import math
import random

# Khởi tạo Pygame
pygame.init()

WIDTH, HEIGHT = 950, 700
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Forsaken 2D - Spacebar Sprint Update")
clock = pygame.time.Clock()

# Bảng màu
BLACK = (15, 15, 15)
WHITE = (240, 240, 240)
RED = (220, 50, 50)
LIGHT_RED = (255, 100, 100)
GREEN = (50, 220, 50)
BLUE = (50, 150, 250)
YELLOW = (240, 240, 50)
PURPLE = (160, 32, 240)
GRAY = (60, 60, 60)

GAME_TIME = 150  # 2 phút 30 giây

# Cấu hình thuộc tính nhân vật kèm MÁU (HP) & TỐC ĐỘ GỐC
SURVIVOR_CLASSES = {
    "Medic": {"base_speed": 3.0, "max_hp": 120, "skill": "Heal Aura", "malice_gain": 0.8},
    "Engineer": {"base_speed": 2.8, "max_hp": 100, "skill": "Overcharge", "malice_gain": 0.6},
    "Scout": {"base_speed": 3.4, "max_hp": 90, "skill": "Dash", "malice_gain": 0.7}
}

KILLER_CLASSES = {
    "The Stalker": {"base_speed": 2.6, "damage": 40, "skill": "Shadow Leap", "malice_gain": 1.5, "range": 120},
    "The Executioner": {"base_speed": 2.2, "damage": 65, "skill": "Slam Attack", "malice_gain": 2.0, "range": 95}
}

class Generator:
    def __init__(self, x, y):
        self.rect = pygame.Rect(x, y, 55, 55)
        self.charges_left = 4
        self.current_progress = 0
        self.completed = False

    def repair(self, amount):
        if self.completed: return 0, 0
        self.current_progress += amount
        if self.current_progress >= 100:
            self.charges_left -= 1
            self.current_progress = 0
            if self.charges_left <= 0:
                self.completed = True
            return 3, 0.5  
        return 0, 0

    def draw(self, surface):
        color = GREEN if self.completed else (YELLOW if self.charges_left < 4 else GRAY)
        pygame.draw.rect(surface, color, self.rect, 0, 6)
        
        font = pygame.font.Font(None, 22)
        txt = font.render(f"x{self.charges_left}" if not self.completed else "OK", True, BLACK if self.completed else WHITE)
        surface.blit(txt, (self.rect.x + 15, self.rect.y + 18))
        
        if not self.completed and self.charges_left > 0:
            pygame.draw.rect(surface, RED, (self.rect.x, self.rect.y - 10, 55, 4))
            pygame.draw.rect(surface, GREEN, (self.rect.x, self.rect.y - 10, int(55 * (self.current_progress / 100)), 4))

class SurvivorEntity:
    def __init__(self, x, y, name, is_bot=False):
        self.x = x
        self.y = y
        self.name = name
        self.is_bot = is_bot
        self.role_data = SURVIVOR_CLASSES[name]
        self.base_speed = self.role_data["base_speed"]
        self.max_hp = self.role_data["max_hp"]
        self.hp = self.max_hp
        
        # Hệ thống Stamina
        self.stamina = 100.0
        self.max_stamina = 100.0
        self.exhausted = False
        
        self.radius = 15
        self.malice = 0.0
        self.alive = True
        self.skill_cooldown = 0
        self.show_hitbox_timer = 0
        self.target_gen = None

    def take_damage(self, amount):
        if not self.alive: return
        self.hp -= amount
        if self.hp <= 0:
            self.hp = 0
            self.alive = False

    def use_skill(self):
        if self.skill_cooldown == 0 and not self.exhausted:
            self.malice += self.role_data["malice_gain"]
            self.skill_cooldown = 180  
            self.show_hitbox_timer = 45 
            self.stamina = max(0.0, self.stamina - 20.0)
            
            if self.name == "Medic" and self.alive:
                self.hp = min(self.max_hp, self.hp + 15)
            elif self.name == "Scout" and self.alive:
                self.stamina = min(self.max_stamina, self.stamina + 40.0)
            return True
        return False

    def handle_stamina(self, is_sprinting, is_moving):
        if self.stamina <= 0:
            self.exhausted = True
        if self.exhausted and self.stamina >= 30: 
            self.exhausted = False

        if is_sprinting and is_moving and not self.exhausted:
            self.stamina = max(0.0, self.stamina - 0.4) 
            return self.base_speed * 1.6 
        else:
            fill_rate = 0.25 if is_moving else 0.45
            self.stamina = min(self.max_stamina, self.stamina + fill_rate)
            return self.base_speed if not self.exhausted else self.base_speed * 0.6

    def update_ai(self, gens, killer_x, killer_y):
        if not self.alive: return False
        
        dist_to_k = math.hypot(killer_x - self.x, killer_y - self.y)
        is_sprinting = dist_to_k < 160 
        
        if dist_to_k < 160:
            angle = math.atan2(self.y - killer_y, self.x - killer_x)
            speed = self.handle_stamina(is_sprinting, True)
            self.x += math.cos(angle) * speed
            self.y += math.sin(angle) * speed
            if random.random() < 0.01: self.use_skill()
        else:
            if not self.target_gen or self.target_gen.completed:
                available = [g for g in gens if not g.completed]
                if available: self.target_gen = random.choice(available)
            
            if self.target_gen:
                dist_to_g = math.hypot(self.target_gen.rect.centerx - self.x, self.target_gen.rect.centery - self.y)
                if dist_to_g > 30:
                    speed = self.handle_stamina(False, True) 
                    angle = math.atan2(self.target_gen.rect.centery - self.y, self.target_gen.rect.centerx - self.x)
                    self.x += math.cos(angle) * speed
                    self.y += math.sin(angle) * speed
                else:
                    self.handle_stamina(False, False)
                    return True 
            else:
                self.handle_stamina(False, False)
        
        self.x = max(self.radius, min(WIDTH - self.radius, self.x))
        self.y = max(self.radius, min(HEIGHT - self.radius, self.y))
        if self.skill_cooldown > 0: self.skill_cooldown -= 1
        if self.show_hitbox_timer > 0: self.show_hitbox_timer -= 1
        return False

    def draw(self, surface):
        if not self.alive: return
        color = BLUE if not self.is_bot else (0, 200, 200)
        pygame.draw.circle(surface, color, (int(self.x), int(self.y)), self.radius)
        
        pygame.draw.rect(surface, GRAY, (self.x - 15, self.y - 23, 30, 3))
        pygame.draw.rect(surface, GREEN, (self.x - 15, self.y - 23, int(30 * (self.hp / self.max_hp)), 3))
        
        if self.is_bot:
            pygame.draw.rect(surface, GRAY, (self.x - 15, self.y - 19, 30, 2))
            pygame.draw.rect(surface, YELLOW, (self.x - 15, self.y - 19, int(30 * (self.stamina / self.max_stamina)), 2))

        if self.show_hitbox_timer > 0:
            pygame.draw.circle(surface, PURPLE, (int(self.x), int(self.y)), 70, 2)

class KillerEntity:
    def __init__(self, x, y, name, is_bot=False):
        self.x = x
        self.y = y
        self.name = name
        self.is_bot = is_bot
        self.role_data = KILLER_CLASSES[name]
        self.base_speed = self.role_data["base_speed"]
        self.damage = self.role_data["damage"]
        self.range = self.role_data["range"]
        
        self.stamina = 100.0
        self.max_stamina = 100.0
        self.exhausted = False
        
        self.radius = 18
        self.malice = 0.0
        self.skill_cooldown = 0
        self.show_hitbox_timer = 0
        self.has_damaged_this_attack = [] 
        self.waypoint = [random.randint(100, WIDTH-100), random.randint(100, HEIGHT-100)]

    def use_attack(self):
        if self.skill_cooldown == 0 and not self.exhausted:
            self.malice += self.role_data["malice_gain"]
            self.skill_cooldown = 120  
            self.show_hitbox_timer = 30  
            self.has_damaged_this_attack = [] 
            self.stamina = max(0.0, self.stamina - 15.0)
            return True
        return False

    def handle_stamina(self, is_sprinting, is_moving):
        if self.stamina <= 0: self.exhausted = True
        if self.exhausted and self.stamina >= 25: self.exhausted = False

        if is_sprinting and is_moving and not self.exhausted:
            self.stamina = max(0.0, self.stamina - 0.5) 
            return self.base_speed * 1.7
        else:
            fill = 0.3 if is_moving else 0.5
            self.stamina = min(self.max_stamina, self.stamina + fill)
            return self.base_speed if not self.exhausted else self.base_speed * 0.5

    def update_ai(self, survivors):
        target = None
        min_dist = 9999
        for s in survivors:
            if s.alive:
                d = math.hypot(s.x - self.x, s.y - self.y)
                if d < min_dist:
                    min_dist = d
                    target = s

        is_sprinting = target and min_dist < 220
        speed = self.handle_stamina(is_sprinting, True)

        if target and min_dist < 220:
            angle = math.atan2(target.y - self.y, target.x - self.x)
            self.x += math.cos(angle) * speed
            self.y += math.sin(angle) * speed
            if min_dist <= self.range - 15:
                self.use_attack()
        else:
            if math.hypot(self.waypoint[0] - self.x, self.waypoint[1] - self.y) < 20:
                self.waypoint = [random.randint(100, WIDTH-100), random.randint(100, HEIGHT-100)]
            angle = math.atan2(self.waypoint[1] - self.y, self.waypoint[0] - self.x)
            self.x += math.cos(angle) * (speed * 0.7)
            self.y += math.sin(angle) * (speed * 0.7)

        if self.skill_cooldown > 0: self.skill_cooldown -= 1
        if self.show_hitbox_timer > 0: self.show_hitbox_timer -= 1

    def draw(self, surface):
        color = RED if not self.is_bot else LIGHT_RED
        pygame.draw.circle(surface, color, (int(self.x), int(self.y)), self.radius)
        
        if self.show_hitbox_timer > 0:
            pygame.draw.circle(surface, (255, 0, 0), (int(self.x), int(self.y)), self.range, 2)


async def main():
    game_state = "SELECT_FACTION"
    my_side = "SURVIVOR" 
    my_class_choice = ""
    
    time_remaining = GAME_TIME
    frame_counter = 0

    player_surv = None
    killer = None
    survivors = []
    
    generators = [Generator(150, 150), Generator(750, 150), Generator(450, 500)]
    running = True
    
    while running:
        screen.fill(BLACK)
        mouse_pos = pygame.mouse.get_pos()
        font_big = pygame.font.Font(None, 36)
        font_sub = pygame.font.Font(None, 24)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                
            if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                if game_state == "SELECT_FACTION":
                    if pygame.Rect(200, 300, 200, 80).collidepoint(mouse_pos):
                        my_side = "SURVIVOR"
                        game_state = "SELECT_CHAR"
                    elif pygame.Rect(550, 300, 200, 80).collidepoint(mouse_pos):
                        my_side = "KILLER"
                        game_state = "SELECT_CHAR"
                
                elif game_state == "SELECT_CHAR":
                    if my_side == "SURVIVOR":
                        y_offset = 250
                        for c_name in SURVIVOR_CLASSES:
                            if pygame.Rect(350, y_offset, 250, 50).collidepoint(mouse_pos):
                                my_class_choice = c_name
                                player_surv = SurvivorEntity(450, 400, my_class_choice, is_bot=False)
                                survivors.append(player_surv)
                                
                                remaining_classes = [c for c in SURVIVOR_CLASSES if c != my_class_choice]
                                survivors.append(SurvivorEntity(200, 350, remaining_classes[0], is_bot=True))
                                survivors.append(SurvivorEntity(700, 350, remaining_classes[1], is_bot=True))
                                
                                killer = KillerEntity(450, 100, random.choice(list(KILLER_CLASSES.keys())), is_bot=True)
                                game_state = "PLAYING"
                                break
                            y_offset += 70
                    else:
                        y_offset = 250
                        for k_name in KILLER_CLASSES:
                            if pygame.Rect(350, y_offset, 250, 50).collidepoint(mouse_pos):
                                my_class_choice = k_name
                                killer = KillerEntity(450, 100, my_class_choice, is_bot=False)
                                
                                all_surv_classes = list(SURVIVOR_CLASSES.keys())
                                survivors.append(SurvivorEntity(200, 400, all_surv_classes[0], is_bot=True))
                                survivors.append(SurvivorEntity(450, 500, all_surv_classes[1], is_bot=True))
                                survivors.append(SurvivorEntity(700, 400, all_surv_classes[2], is_bot=True))
                                game_state = "PLAYING"
                                break
                            y_offset += 70

            if game_state == "PLAYING" and event.type == pygame.KEYDOWN:
                if event.key == pygame.K_e:
                    if my_side == "SURVIVOR" and player_surv.alive:
                        player_surv.use_skill()
                    elif my_side == "KILLER":
                        killer.use_attack()

        # =========================================================
        # LOGIC TRẬN ĐẤU (PLAYING)
        # =========================================================
        if game_state == "PLAYING":
            frame_counter += 1
            if frame_counter % 60 == 0 and time_remaining > 0:
                time_remaining -= 1

            keys = pygame.key.get_pressed()
            dx, dy = 0, 0
            if keys[pygame.K_a]: dx = -1
            if keys[pygame.K_d]: dx = 1
            if keys[pygame.K_w]: dy = -1
            if keys[pygame.K_s]: dy = 1
            if dx != 0 and dy != 0: dx, dy = dx * 0.7071, dy * 0.7071

            is_moving = dx != 0 or dy != 0
            # --- MODIFIED: Đổi sang nhận diện nút Spacebar (Dấu cách) ---
            is_sprinting = keys[pygame.K_SPACE] 

            if my_side == "SURVIVOR" and player_surv.alive:
                current_speed = player_surv.handle_stamina(is_sprinting, is_moving)
                player_surv.x += dx * current_speed
                player_surv.y += dy * current_speed
                
                if keys[pygame.K_q]:
                    for gen in generators:
                        if gen.rect.colliderect(pygame.Rect(player_surv.x-15, player_surv.y-15, 30, 30)):
                            time_deduct, malice_gain = gen.repair(0.4)
                            time_remaining = max(0, time_remaining - time_deduct)
                            player_surv.malice += malice_gain
                
                if player_surv.skill_cooldown > 0: player_surv.skill_cooldown -= 1
                if player_surv.show_hitbox_timer > 0: player_surv.show_hitbox_timer -= 1
            
            elif my_side == "KILLER":
                current_speed = killer.handle_stamina(is_sprinting, is_moving)
                killer.x += dx * current_speed
                killer.y += dy * current_speed
                if killer.skill_cooldown > 0: killer.skill_cooldown -= 1
                if killer.show_hitbox_timer > 0: killer.show_hitbox_timer -= 1

            if my_side == "SURVIVOR" or killer.is_bot:
                killer.update_ai(survivors)
                
            for s in survivors:
                if s.is_bot:
                    is_repairing = s.update_ai(generators, killer.x, killer.y)
                    if is_repairing and s.target_gen:
                        time_deduct, malice_gain = s.target_gen.repair(0.2)
                        time_remaining = max(0, time_remaining - time_deduct)
                        s.malice += malice_gain

            if killer.show_hitbox_timer > 0:
                for s in survivors:
                    if s.alive and (s not in killer.has_damaged_this_attack):
                        dist = math.hypot(s.x - killer.x, s.y - killer.y)
                        if dist <= killer.range: 
                            s.take_damage(killer.damage)
                            killer.has_damaged_this_attack.append(s)

            surv_alive_count = sum(1 for s in survivors if s.alive)
            if surv_alive_count == 0 or time_remaining <= 0:
                game_state = "END"
                result_text = "KILLER WIN! Trận đấu kết thúc."
            elif all(g.completed for g in generators):
                game_state = "END"
                result_text = "SURVIVORS TRỐN THOÁT THÀNH CÔNG! WIN!"

            for gen in generators: gen.draw(screen)
            for s in survivors: s.draw(screen)
            killer.draw(screen)

            # HUD hiển thị Thể lực
            my_stamina = player_surv.stamina if my_side == "SURVIVOR" else killer.stamina
            is_ex = player_surv.exhausted if my_side == "SURVIVOR" else killer.exhausted
            stamina_color = GREEN if my_stamina > 50 else (YELLOW if my_stamina > 20 else RED)
            if is_ex: stamina_color = RED 
            
            pygame.draw.rect(screen, GRAY, (WIDTH - 220, HEIGHT - 50, 200, 15), 0, 4)
            pygame.draw.rect(screen, stamina_color, (WIDTH - 220, HEIGHT - 50, int(200 * (my_stamina / 100)), 15), 0, 4)
            
            hud_label = font_sub.render(f"STAMINA: {int(my_stamina)}% " + ("(KIỆT SỨC)" if is_ex else ""), True, WHITE)
            screen.blit(hud_label, (WIDTH - 220, HEIGHT - 75))

            minutes = time_remaining // 60
            seconds = time_remaining % 60
            screen.blit(font_big.render(f"Thời gian: {minutes:02d}:{seconds:02d}", True, WHITE), (380, 20))

            y_ui = 60
            for i, s in enumerate(survivors):
                status_str = f"HP: {int(s.hp)}/{s.max_hp}" if s.alive else "DEAD"
                my_tag = " (Bạn)" if not s.is_bot else ""
                txt = font_sub.render(f"Surv {i+1} [{s.name}]{my_tag}: {status_str} | Malice: {s.malice:.1f}", True, BLUE if s.alive else GRAY)
                screen.blit(txt, (20, y_ui))
                y_ui += 25
                
            k_tag = " (Bạn)" if not killer.is_bot else ""
            ktxt = font_sub.render(f"Killer [{killer.name}]{k_tag}: Sát thương: {killer.damage} | Malice: {killer.malice:.1f}", True, RED)
            screen.blit(ktxt, (20, y_ui + 10))

            # --- MODIFIED UI TEXT: Sửa lại dòng hướng dẫn cho đúng phím SPACE ---
            inst_str = "[W,A,S,D] Di chuyển | Giữ [SPACE] để chạy nhanh | [E] Kỹ năng"
            if my_side == "SURVIVOR": inst_str += " | Giữ [Q] sửa máy"
            screen.blit(font_sub.render(inst_str, True, WHITE), (20, HEIGHT - 30))

        # =========================================================
        # GIAO DIỆN LỰA CHỌN
        # =========================================================
        elif game_state == "SELECT_FACTION":
            title = font_big.render("CHỌN PHE TRONG FORSAKEN 2D", True, WHITE)
            screen.blit(title, (280, 180))
            pygame.draw.rect(screen, BLUE, (200, 300, 200, 80), 0, 8)
            pygame.draw.rect(screen, RED, (550, 300, 200, 80), 0, 8)
            screen.blit(font_big.render("SURVIVOR", True, WHITE), (230, 325))
            screen.blit(font_big.render("KILLER", True, WHITE), (600, 325))

        elif game_state == "SELECT_CHAR":
            title = font_big.render(f"CHỌN LỚP NHÂN VẬT ({my_side})", True, WHITE)
            screen.blit(title, (320, 150))
            y_offset = 250
            if my_side == "SURVIVOR":
                for c_name, data in SURVIVOR_CLASSES.items():
                    pygame.draw.rect(screen, GRAY, (350, y_offset, 250, 50), 0, 5)
                    txt = font_sub.render(f"{c_name} (Tốc gốc: {data['base_speed']})", True, WHITE)
                    screen.blit(txt, (360, y_offset + 15))
                    y_offset += 70
            else:
                for k_name, data in KILLER_CLASSES.items():
                    pygame.draw.rect(screen, RED, (350, y_offset, 250, 50), 0, 5)
                    txt = font_sub.render(f"{k_name}", True, WHITE)
                    screen.blit(txt, (370, y_offset + 15))
                    y_offset += 70

        elif game_state == "END":
            screen.blit(font_big.render(result_text, True, YELLOW), (150, HEIGHT // 2 - 20))

        pygame.display.flip()
        clock.tick(60)
        await asyncio.sleep(0)

pygame.quit()
