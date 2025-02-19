import React from 'react'
import { Github, Globe, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            About ChatFlow
          </h1>
          <p className="text-base-content/80 text-lg">
            A modern real-time chat application built with cutting-edge technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Features</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Real-time messaging</li>
                <li>User authentication</li>
                <li>Profile customization</li>
                <li>Dark/Light theme support</li>
                <li>Responsive design</li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Tech Stack</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>React + Vite</li>
                <li>Node.js + Express</li>
                <li>MongoDB</li>
                <li>Socket.IO</li>
                <li>TailwindCSS + DaisyUI</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="divider">Developer</div>

        <div className="text-center space-y-4">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://github.com/Riyakuila.png" alt="Developer" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Riya Kuila</h2>
            <p className="text-base-content/70">Full Stack Developer</p>
          </div>

          <div className="flex justify-center gap-4">
            <a href="https://github.com/Riyakuila" target="_blank" rel="noopener noreferrer" 
              className="btn btn-ghost btn-sm gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a href="https://linkedin.com/in/riya-kuila-5576182b4" target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost btn-sm gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost btn-sm gap-2">
              <Globe className="w-4 h-4" />
              Portfolio
            </a>
            <a href="mailto:your.riyakuila539@gmail.com"
              className="btn btn-ghost btn-sm gap-2">
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/signup" className="btn btn-primary">
            Get Started with ChatFlow
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
