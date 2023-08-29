#!/usr/bin/env python3
"""Setup a basic Flask app in 1-app.py.
Create a single / route and an index.html template
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
from typing import Dict, Union

# Mock user data
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config(object):
    """Class to configure available languages in our app
    """

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


# Our flask app configuration
app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


def get_user() -> Union[Dict, None]:
    """Module for getting a user details
    """
    login_id = request.args.get('login_as')
    if login_id:
        return users.get(int(login_id))
    return None


@app.before_request
def before_request() -> None:
    """Sets a user as global
    """
    g.user = get_user()


@babel.localeselector
def get_locale() -> str:
    """Determine the best match with our supported languages.
    """

    # Get the value of 'locale' from URL parameter
    locale = request.args.get('locale')
    if locale in app.config["LANGUAGES"]:
        return locale  # Use the provided locale if it's valid

        # Get the value of 'locale' from user settings
    if g.user:
        locale = g.user.get('locale')
        if locale and locale in app.config["LANGUAGES"]:
            return locale

        # Get the value of 'locale' from request header
    locale = request.headers.get('locale', None)
    if locale in app.config["LANGUAGES"]:
        return locale

    # Fall back to the default behavior
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route('/')
def index() -> str:
    """Function that returns an index page
    """
    return render_template(
        '6-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
