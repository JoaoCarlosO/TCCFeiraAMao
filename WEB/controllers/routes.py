from flask import render_template, request, redirect, url_for, flash


def init_app(app):
    app.secret_key = 'sua-chave-secreta'  # Obrigatório para usar flash

    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']

            if username == 'admin@email.com' and password == '12345':
                flash('Login realizado com sucesso!', 'success')
                return redirect(url_for('home'))
            else:
                flash('Credenciais inválidas.', 'error')
                return redirect(url_for('home'))

        # Apenas exibe o formulário no GET
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

            # Verificação de dados (apenas para simulação)
            if (
                nome == 'admin' and telefone == '13 997549008' and
                email == 'admin@email.com' and nascimento == '2007-10-03' and cpf == '495.780.418-45' and senha == '12345'
            ):
                flash('Cadastro realizado com sucesso!', 'success')
                return redirect(url_for('home'))
            else:
                flash('Preencha os dados corretamente para se cadastrar.', 'error')
                return redirect(url_for('home'))

        # Exibe o formulário se for GET
        return render_template('cadastro.html')

    @app.route('/perfil', methods=['GET', 'POST'])
    def perfil():
        if request.method == 'POST':
            nome = request.form.get('nome')
            cpf = request.form.get('cpf')
            endereco = request.form.get('endereco')
            email = request.form.get('email')
            telefone = request.form.get('telefone')
            senha = request.form.get('senha')

            if nome and cpf and endereco and email and telefone and senha:
                flash('Perfil atualizado com sucesso!', 'success')
                return redirect(url_for('home'))
            else:
                flash('Por favor, preencha todos os campos.', 'error')
                return redirect(url_for('home'))

        return render_template('perfil.html')

    @app.route('/sobre')
    def sobre():
        return render_template('sobre.html')
