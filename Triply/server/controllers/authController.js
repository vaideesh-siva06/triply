import db from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = (req, res) => {
    const salt = 10;

    const { name, email, password } = req.body;

    const checkEmail = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmail, [email], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database error" });
        }


        if (results.length > 0) {
            return res.status(400).json({ field: "email", message: "Email already exists" });
        }

        const insertSql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        bcrypt.hash(password.toString(), salt, (err, hash) => {
            if (err) return res.json({error: "Error for hashing password"});

            db.query(insertSql, [name, email, hash], (err, data) => {
                if (err) return res.status(500).json({ error: "Insert error" });
                return res.status(201).json({ message: "User created successfully" });
            });

        })
    });
}

export const login = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Login error in server" });

    if (results.length > 0) {
      bcrypt.compare(password.toString(), results[0].password, (err, response) => {
        if (err) {
          return res.status(500).json({ error: "Password compare error" });
        }

        if (response) {
          const id = results[0].id;
          const token = jwt.sign({ id }, process.env.JWT_SECRET || "jwt-secret-key", {
            expiresIn: '4h'
          });

          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
          });

          return res.status(200).json({ message: "Success!" });
        } else {
          return res.status(401).json({ message: "User or password is incorrect" });
        }
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
};

export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.promise().query("DELETE FROM itineraries WHERE creator_id = ?", [id]);
      const [result] = await db.promise().query("DELETE FROM users WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user account" });
  }
}

export const updateUser = async (req, res) => {
    try {
      const { id } = req.params; 
      const { username, email } = req.body;

      if (!username || !email) {
        return res.status(400).json({ error: "Username and email are required" });
      }

      const [existing] = await db
        .promise()
        .query("SELECT id FROM users WHERE email = ? AND id != ?", [email, id]);

      if (existing.length > 0) {
        return res.status(400).json({ error: "Email is already in use" });
      }

      const [result] = await db
        .promise()
        .query("UPDATE users SET username = ?, email = ? WHERE id = ?", [username, email, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Failed to update user" });
    }
}