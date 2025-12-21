Pythonimport pygame
import random
import time
from pygame.locals import *

pygame.init()
LARGURA, ALTURA = 500, 900
tela = pygame.display.set_mode((LARGURA, ALTURA))
pygame.display.set_caption("TikTok Simulator 2D")
relogio = pygame.time.Clock()
fonte = pygame.font.Font(None, 40)
fonte_peq = pygame.font.Font(None, 28)

# Cores TikTok
PRETO = (0, 0, 0)
BRANCO = (255, 255, 255)
ROSA = (255, 105, 180)
AZUL = (0, 170, 255)
VERMELHO = (255, 0, 0)
VERDE = (0, 255, 100)

# Dados do jogador
perfil = {
    'nome': "@SeuUser",
    'seguidores': 0,
    'curtidas_totais': 0,
    'videos': []  # lista de vídeos postados
}

# Vídeos do feed (dicionários)
class Video:
    def __init__(self, titulo, curtidas, comentarios, dueto=False, cor_fundo=ROSA):
        self.titulo = titulo
        self.curtidas = curtidas
        self.comentarios = comentarios
        self.dueto = dueto
        self.cor_fundo = cor_fundo
        self.y = random.randint(100, ALTURA * 2)  # posição inicial aleatória

videos_feed = [
    Video("Dança nova do momento 💃", 15000, 2300, cor_fundo=(255, 182, 193)),
    Video("Gatinho fazendo parkour 🐱", 45000, 8900, cor_fundo=(100, 149, 237)),
    Video("Receita rápida 15s 🍳", 32000, 4500, cor_fundo=(255, 255, 0)),
    Video("Eu tentando ser engraçado 😂", 12000, 1800, cor_fundo=(221, 160, 221)),
    Video("Dueto com você? 🎤", 28000, 4100, dueto=True, cor_fundo=(0, 255, 255))
]

# Animação simples pro vídeo
def animar_video(tela, video, y_pos):
    # Fundo
    tela.fill(video.cor_fundo)
    # Ícone de play (simula vídeo)
    pygame.draw.circle(tela, BRANCO, (LARGURA//2, y_pos + 200), 60)
    pygame.draw.polygon(tela, PRETO, [(LARGURA//2 - 20, y_pos + 170), (LARGURA//2 + 40, y_pos + 200), (LARGURA//2 - 20, y_pos + 230)])
    # Texto
    txt = fonte.render(video.titulo, True, BRANCO)
    tela.blit(txt, (20, y_pos + 30))
    # Curtidas e comentários
    curt = fonte_peq.render(f"❤️ {video.curtidas}   💬 {video.comentarios}", True, BRANCO)
    tela.blit(curt, (20, y_pos + 450))
    if video.dueto:
        dueto_txt = fonte_peq.render("Dueto disponível 🎤", True, VERDE)
        tela.blit(dueto_txt, (20, y_pos + 490))

# Botões interativos
botoes = {
    'curtir': pygame.Rect(20, ALTURA - 150, 80, 80),
    'comentar': pygame.Rect(120, ALTURA - 150, 80, 80),
    'seguir': pygame.Rect(220, ALTURA - 150, 80, 80),
    'dueto': pygame.Rect(320, ALTURA - 150, 80, 80),
    'gravar': pygame.Rect(LARGURA - 120, ALTURA - 120, 100, 100)
}

# Feed scroll
scroll_y = 0
scroll_vel = 0

# Estado: feed ou perfil
estado = "feed"

# Gravar vídeo
gravando = False
tempo_gravacao = 0
novo_video = None

rodando = True
while rodando:
    for evento in pygame.event.get():
        if evento.type == QUIT:
            rodando = False
        if evento.type == MOUSEBUTTONDOWN:
            mouse = pygame.mouse.get_pos()
            if estado == "feed":
                if botoes['curtir'].collidepoint(mouse):
                    videos_feed[0].curtidas += 1
                    perfil['curtidas_totais'] += 1
                if botoes['seguir'].collidepoint(mouse):
                    perfil['seguidores'] += 10
                if botoes['dueto'].collidepoint(mouse) and videos_feed[0].dueto:
                    print("Dueto feito! 🎤 +50 curtidas")
                    videos_feed[0].curtidas += 50
                if botoes['gravar'].collidepoint(mouse):
                    gravando = True
                    tempo_gravacao = time.time()
                    print("GRAVANDO... (15s)")
        if evento.type == MOUSEWHEEL:
            scroll_vel += evento.y * 30

    # Scroll suave
    scroll_y += scroll_vel
    scroll_vel *= 0.85  # desacelera

    # Gravação
    if gravando:
        tempo_passado = time.time() - tempo_gravacao
        if tempo_passado > 15:
            gravando = False
            # Cria novo vídeo
            novo_video = Video("Meu vídeo épico! 🔥", 0, 0)
            perfil['videos'].append(novo_video)
            videos_feed.insert(0, novo_video)
            print("Vídeo postado! 📤")
        else:
            # Mostra contador
            tela.fill((0, 0, 0))
            txt = fonte.render(f"Gravando: {int(15 - tempo_passado)}s", True, VERMELHO)
            tela.blit(txt, (50, ALTURA//2))
            pygame.display.flip()
            relogio.tick(30)
            continue

    # Desenhar feed
    tela.fill(PRETO)
    for i, video in enumerate(videos_feed):
        y_pos = i * 600 + scroll_y
        if -600 < y_pos < ALTURA + 600:
            animar_video(tela, video, y_pos)

    # HUD
    if estado == "feed":
        # Botões
        pygame.draw.circle(tela, ROSA, (botoes['curtir'].center), 40)
        tela.blit(fonte.render("❤️", True, BRANCO), (botoes['curtir'].x + 25, botoes['curtir'].y + 20))

        pygame.draw.circle(tela, AZUL, (botoes['comentar'].center), 40)
        tela.blit(fonte.render("💬", True, BRANCO), (botoes['comentar'].x + 25, botoes['comentar'].y + 20))

        pygame.draw.circle(tela, VERDE, (botoes['seguir'].center), 40)
        tela.blit(fonte.render("➕", True, BRANCO), (botoes['seguir'].x + 25, botoes['seguir'].y + 20))

        pygame.draw.circle(tela, AMARELO, (botoes['dueto'].center), 40)
        tela.blit(fonte.render("🎤", True, BRANCO), (botoes['dueto'].x + 25, botoes['dueto'].y + 20))

        # Botão gravar (canto inferior direito)
        pygame.draw.circle(tela, VERMELHO, (botoes['gravar'].center), 50)
        tela.blit(fonte.render("R", True, BRANCO), (botoes['gravar'].x + 35, botoes['gravar'].y + 30))

        # Perfil info
        txt_perfil = fonte_peq.render(f"{perfil['nome']}   {perfil['seguidores']} seguidores", True, BRANCO)
        tela.blit(txt_perfil, (20, 20))
        txt_curtidas = fonte_peq.render(f"❤️ {perfil['curtidas_totais']} curtidas", True, ROSA)
        tela.blit(txt_curtidas, (20, 60))

    pygame.display.flip()
    relogio.tick(60)

pygame.quit()
