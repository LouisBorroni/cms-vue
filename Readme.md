Pour lancer l'application :

bdd :
- il faudra surement créer la table users si c'est pas déjà fait
- http://localhost:8895/
- user : root
- password : mysqltests
- créer la bdd : 
        CREATE DATABASE IF NOT EXISTS cms_db;

        USE cms_db;

        CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user'
        );

        CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO articles (name, description, price, image_url)
        VALUES 
        ('Pizza Margherita', 'Pizza avec sauce tomate, mozzarella et basilic', 9.90,
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

        ('Burger Classique', 'Pain, steak, salade, tomate, oignons', 8.50,
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'),

        ('Sushi Saumon', '6 pièces de sushi au saumon frais', 12.00,
        'https://images.unsplash.com/photo-1744360515510-db7bf0f6def8?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

        ('Salade César', 'Salade, poulet, parmesan, croûtons, sauce césar', 7.80,
        'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

        ('Tacos Poulet', 'Galette mexicaine avec poulet, légumes et sauce', 6.90,
        'https://images.unsplash.com/photo-1570461226513-e08b58a52c53?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

        ('Glace Vanille', 'Boules de glace vanille crémeuse', 4.50,
        'https://images.unsplash.com/photo-1568903880699-b53f3e0c2b96?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');


        CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        items JSON NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );





frontend : 
- cd frontend
- npm i
- http://localhost:5173/

backend : 
- cd backend 
- npm i
- npm run dev