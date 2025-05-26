from flask import render_template, request


def init_app(app):
    # Criando a rota principal do site
    @app.route('/')
    # Criando função no Python
    # View function - Função de vizualização
    def home():
        return render_template('index.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            if username == 'admin' and password == 'admin':
                return render_template('login.html', success='Login successful')
            else:
                return render_template('login.html', error='Invalid credentials')
        return render_template('login.html')

    @app.route('/cadastro', methods=['GET', 'POST'])
    def cadastro():
        if request.method == 'POST':
            nome = request.form.get('nome')
            telefone = request.form.get('telefone')
            email = request.form.get('email')
            nascimento = request.form.get('nascimento')
            cpf = request.form.get('cpf')
            senha = request.form.get('senha')

            if nome == 'admin' and senha == 'senha' and telefone == 'telefone' and email == 'email' and nascimento == 'nascimento' and cpf == 'cpf':
                return render_template('cadastro.html', success='Cadastro successful')
            else:
                return render_template('cadastro.html', error='Invalid credentials')
        return render_template('cadastro.html')
        

