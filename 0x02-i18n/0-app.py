#!/usr/bin/env python3
"""Setup a basic Flask app in 0-app.py.
Create a single / route and an index.html template
"""
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    """Function that returns an index page"""
    return render_template("0-index.html")


app.run(port=5000)