from flask import render_template, request  

jogadores = ['iruh', 'davi_lambari', 'edsongf',
             'kioto', 'black butterfly', 'jujudopix']

# Array de objetos
gamelist = [{'Título': 'CS-GO',
            'Ano': 2012,
             'Categoria': 'FPS Online'}]

consolelist = [{'Nome': 'PS5',
                'Preço': 5.000,
                'País': 'Brasil'}]


def init_app(app):
    # Criando a rota principal do site
    @app.route('/')
    # Criando função no Python
    # View function - Função de vizualização
    def home():
        return render_template('index.html')
