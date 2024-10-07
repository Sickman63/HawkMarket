router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword, email });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });