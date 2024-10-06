export const template = `
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
        <p><strong>English:</strong></p>
        <p>Welcome! You have been successfully registered in our application.</p>
        <p>Your username is <b>{username}</b></p>
        <p>Your temporary password is <b>{####}</b></p>
        <a href="\${url}" style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Log in to app</a>
    </div>



    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
        <p><strong>Português:</strong></p>
        <p>Bem-vindo! Você foi registrado com sucesso em nossa aplicação.</p>
        <p>Seu nome de usuário é <b>{username}</b></p>
        <p>Sua senha temporária é <b>{####}</b></p>
        <a href="\${url}" style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Entrar na aplicação</a>
    </div>



    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
        <p><strong>Español:</strong></p>
        <p>¡Bienvenido! Ha sido registrado con éxito en nuestra aplicación.</p>
        <p>Su nombre de usuario es <b>{username}</b></p>
        <p>Su contraseña temporal es <b>{####}</b></p>
        <a href="\${url}" style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Iniciar sesión en la aplicación</a>
    </div>
</body>
</html>`;