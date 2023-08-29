#!/usr/bin/env python3
"""Setup a basic Flask app in 1-app.py.
Create a single / route and an index.html template
"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config():
    """Class to configure available languages in our app"""

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@app.route('/')
def index():
    """Function that returns an index page"""
    return render_template("0-index.html")


@babel.localeselector
def get_locale():
    """Determine the best match with our supported languages.
    """
    return request.accept_languages.best_match(Config.LANGUAGES)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
