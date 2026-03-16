import pygame
import random
import sys

# Инициализация Pygame
pygame.init()

# Настройки окна
SCREEN_SIZE = 600
GRID_SIZE = 20
CELL_SIZE = SCREEN_SIZE // GRID_SIZE

screen = pygame.display.set_mode((SCREEN_SIZE, SCREEN_SIZE))
pygame.display.set_caption('Snake Game')

# Цвета
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)

# Класс змейки
class Snake:
    def __init__(self):
        self.body = [(5, 5), (4, 5), (3, 5)]
        self.direction = 'RIGHT'
        self.grow = False

    def move(self):
        head_x, head_y = self.body[0]
        if self.direction == 'UP':
            new_head = (head_x, head_y - 1)
        elif self.direction == 'DOWN':
            new_head = (head_x, head_y + 1)
        elif self.direction == 'LEFT':
            new_head = (head_x - 1, head_y)
        elif self.direction == 'RIGHT':
            new_head = (head_x + 1, head_y)
        
        self.body.insert(0, new_head)
        if not self.grow:
            self.body.pop()
        else:
            self.grow = False

    def change_direction(self, new_direction):
        # Проверка на противоположное направление
        if (new_direction == 'UP' and self.direction != 'DOWN') or \
           (new_direction == 'DOWN' and self.direction != 'UP') or \
           (new_direction == 'LEFT' and self.direction != 'RIGHT') or \
           (new_direction == 'RIGHT' and self.direction != 'LEFT'):
            self.direction = new_direction

    def draw(self, screen):
        for segment in self.body:
            pygame.draw.rect(screen, GREEN, 
                            (segment[0]*CELL_SIZE, segment[1]*CELL_SIZE, 
                             CELL_SIZE, CELL_SIZE))

    def check_collision(self):
        # Столкновение с собой
        if self.body[0] in self.body[1:]:
            return True
        # Столкновение со стеной
        head = self.body[0]
        if head[0] < 0 or head[0] >= GRID_SIZE or head[1] < 0 or head[1] >= GRID_SIZE:
            return True
        return False

# Класс яблока
class Apple:
    def __init__(self, snake_body):
        self.reposition(snake_body)

    def reposition(self, snake_body):
        while True:
            new_pos = (random.randint(0, GRID_SIZE-1), random.randint(0, GRID_SIZE-1))
            if new_pos not in snake_body:
                self.position = new_pos
                break

    def draw(self, screen):
        pygame.draw.rect(screen, RED, 
                        (self.position[0]*CELL_SIZE, self.position[1]*CELL_SIZE, 
                         CELL_SIZE, CELL_SIZE))

# Основная функция игры
def main():
    clock = pygame.time.Clock()
    snake = Snake()
    apple = Apple(snake.body)
    game_over = False

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP:
                    snake.change_direction('UP')
                elif event.key == pygame.K_DOWN:
                    snake.change_direction('DOWN')
                elif event.key == pygame.K_LEFT:
                    snake.change_direction('LEFT')
                elif event.key == pygame.K_RIGHT:
                    snake.change_direction('RIGHT')

        if not game_over:
            snake.move()

            # Проверка на съедание яблока
            if snake.body[0] == apple.position:
                snake.grow = True
                apple.reposition(snake.body)

            # Проверка на столкновение
            if snake.check_collision():
                game_over = True

        # Отрисовка
        screen.fill(BLACK)
        snake.draw(screen)
        apple.draw(screen)

        # Отображение сообщения при окончании игры
        if game_over:
            font = pygame.font.SysFont(None, 50)
            text = font.render('Game Over!', True, WHITE)
            screen.blit(text, (SCREEN_SIZE//2 - 100, SCREEN_SIZE//2 - 25))
            pygame.display.flip()
            pygame.time.delay(2000)
            pygame.quit()
            sys.exit()

        pygame.display.flip()
        clock.tick(10)  # Скорость игры (10 кадров в секунду)

if __name__ == "__main__":
    main()
