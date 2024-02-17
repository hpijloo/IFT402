from flask import Flask, jsonify, request, render_template
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)

# Database configuration
db_config = {
    'host': 'ls-3a587ba07dd10fa428761ba6f5ded7ca8dab047f.c1aa2qkkunko.us-west-2.rds.amazonaws.com',
    'user': 'dbmasteruser',
    'password': 'W{0BGD7H`1)mQ,q(^;^{nUb-8*&p7;PQ',
    'database': 'dbmaster'
}

# Connect to MySQL database
def db_connection():
    conn = None
    try:
        conn = mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
    return conn

# Root route
@app.route('/')
def index():
    conn = db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Hikes")
    hikes = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('index', hikes=hikes)

@app.route('/login')
def login():
    return render_template('login')

@app.route('/account')
def account():
    return render_template('account')

@app.route('/loginuser', methods=['POST'])
def loginuser():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Initial response if username or password not provided
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    conn = db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            user_record = cursor.fetchone()
            if user_record and check_password_hash(user_record['Password'], password):
                # Login successful
                return jsonify({'message': 'Login successful'}), 200
            else:
                # Login failed
                return jsonify({'message': 'Invalid username or password'}), 401
        except Error as e:
            print(f"Error: {e}")
            return jsonify({'message': 'An error occurred. Please try again.'}), 500
        finally:
            cursor.close()
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500




@app.route('/accessibility')
def accessibility():
    return render_template('accessibility')

@app.route('/timemanagement')
def timemanagement():
    return render_template('time')

@app.route('/createaccount')
def createaccount():
    return render_template('newacct')

@app.route('/about')
def about():
    return render_template('about')

# Fetch all users
@app.route('/hikes', methods=['GET'])
def get_hikes():
    conn = db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Hikes")
    hikes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(hikes)

@app.route('/createuser', methods=['POST'])
def create_user():
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Username and password are required'}), 400

    username = data['username']
    password = generate_password_hash(data['password'])

    conn = db_connection()
    if conn is not None:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user_exists = cursor.fetchone()
        if user_exists:
            cursor.close()
            conn.close()
            return jsonify({'message': 'Username already exists'}), 400

        # Insert the new user
        try:
            cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
            conn.commit()
        except Error as e:
            conn.rollback()
            print(f"Error: {e}")
            return jsonify({'message': 'Failed to create user'}), 500
        finally:
            cursor.close()
            conn.close()

        return jsonify({'message': 'User created successfully'}), 201
    else:
        return jsonify({'message': 'Database connection failed'}), 500

@app.route('/changepw', methods=['POST'])
def changepw():
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Username and password are required'}), 400

    username = data['username']
    new_password = generate_password_hash(data['password'])

    conn = db_connection()
    if conn is not None:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user_exists = cursor.fetchone()
        if not user_exists:
            cursor.close()
            conn.close()
            return jsonify({'message': 'Username does not exist'}), 404

        # Update the user's password
        try:
            cursor.execute("UPDATE users SET password = %s WHERE username = %s", (new_password, username))
            conn.commit()
        except Error as e:
            conn.rollback()
            print(f"Error: {e}")
            return jsonify({'message': 'Failed to update password'}), 500
        finally:
            cursor.close()
            conn.close()

        return jsonify({'message': 'Password updated successfully'}), 200
    else:
        return jsonify({'message': 'Database connection failed'}), 500

@app.route('/prefdiff', methods=['POST'])
def preferred_difficulty():
    data = request.get_json()

    if not data or 'username' not in data or 'difficulty' not in data:
        return jsonify({'message': 'Username and New Preference are required'}), 400

    username = data['username']
    new_pref = data['difficulty']

    conn = db_connection()
    if conn is not None:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user_exists = cursor.fetchone()
        if not user_exists:
            cursor.close()
            conn.close()
            return jsonify({'message': 'Username does not exist'}), 404

        # Update the user's password
        try:
            cursor.execute("UPDATE users SET PreferredDifficulty = %s WHERE username = %s", (new_pref, username))
            conn.commit()
        except Error as e:
            conn.rollback()
            print(f"Error: {e}")
            return jsonify({'message': 'Failed to update preferences'}), 500
        finally:
            cursor.close()
            conn.close()

        return jsonify({'message': 'Preference updated successfully'}), 200
    else:
        return jsonify({'message': 'Database connection failed'}), 500
@app.route('/prefdiff', methods=['GET'])
def preferred_difficulty_get():
    username = request.args.get('username')

    if not username:
        return jsonify({'message': 'Username is required'}), 400

    conn = db_connection()
    if conn is not None:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT PreferredDifficulty FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()
            if not user:
                return jsonify({'message': 'Username does not exist'}), 404

            return jsonify({'username': username, 'PreferredDifficulty': user['PreferredDifficulty']}), 200
        except Error as e:
            print(f"Error: {e}")
            return jsonify({'message': 'Failed to retrieve preferences'}), 500
        finally:
            cursor.close()
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500


@app.route('/prefduration', methods=['POST'])
def preferred_duration():
    data = request.get_json()

    if not data or 'username' not in data or 'duration' not in data:
        return jsonify({'message': 'Username and Duration are required'}), 400

    username = data['username']
    new_pref = data['duration']

    conn = db_connection()
    if conn is not None:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user_exists = cursor.fetchone()
        if not user_exists:
            cursor.close()
            conn.close()
            return jsonify({'message': 'Username does not exist'}), 404

        # Update the user's password
        try:
            cursor.execute("UPDATE users SET PreferredDuration = %s WHERE username = %s", (new_pref, username))
            conn.commit()
        except Error as e:
            conn.rollback()
            print(f"Error: {e}")
            return jsonify({'message': 'Failed to update preferences'}), 500
        finally:
            cursor.close()
            conn.close()

        return jsonify({'message': 'Preference updated successfully'}), 200
    else:
        return jsonify({'message': 'Database connection failed'}), 500
@app.route('/prefduration', methods=['GET'])
def preferred_duration_get():
    username = request.args.get('username')

    if not username:
        return jsonify({'message': 'Username is required'}), 400

    conn = db_connection()
    if conn is not None:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT PreferredDuration FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()
            if not user:
                return jsonify({'message': 'Username does not exist'}), 404

            return jsonify({'username': username, 'PreferredDuration': user['PreferredDuration']}), 200
        except Error as e:
            print(f"Error: {e}")
            return jsonify({'message': 'Failed to retrieve preferences'}), 500
        finally:
            cursor.close()
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
