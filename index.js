import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Utils
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { Login, Name, Password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { login: Login },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Login is already taken' });
        }

        const hashedPassword = await hashPassword(Password);
        const user = await prisma.user.create({
            data: {
                login: Login,
                name: Name,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { Login, Password } = req.body;

        const user = await prisma.user.findUnique({ where: { login: Login } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(Password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
});
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const apiKey = "d855022feded1934f8590f123da7b216";

const coordinates = {
  lat: "40.741895",
  lon: "-73.989308",
};

const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;

app.get("/", (req, res) => {
  res.send("Weather app backend API :)");
});

app.get("/api/weather", async (req, res) => {
  await fetch(apiUrl)
    .then((apiResponse) => {
      if (apiResponse.ok) {
        return apiResponse.json();
      }
    })
    .then((responseJson) => {
      res.status(200).send(responseJson);
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
});
app.get('/', (req, res) => {
    res.send("Weather app backend API x33333 :)");
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
