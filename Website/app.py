from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return """
    <h1>Orleans Civic Engagement Platform</h1>
    <h2>Louisiana Civic Engagement OS</h2>
    <p>✔ Flask is running successfully.</p>
    """

if __name__ == "__main__":
    app.run(debug=True)