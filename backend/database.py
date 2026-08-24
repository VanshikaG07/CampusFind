import mysql.connector


def get_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="VanshikaG07",
        database="campusfind"
    )

    return connection