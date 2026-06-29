"""
Database connection module using PyMySQL.

Manages MySQL connection lifecycle and abstracts all query operations
using asyncio.to_thread for async compatibility in FastAPI.
"""

import os
import asyncio
import pymysql
import json
from dotenv import load_dotenv

load_dotenv()


class Database:
    """Singleton database connection manager for MySQL."""

    def __init__(self):
        self.connected = False

    def _get_raw_connection(self, include_db=True):
        host = os.getenv("MYSQL_HOST", "localhost")
        port = int(os.getenv("MYSQL_PORT", 3306))
        user = os.getenv("MYSQL_USER", "root")
        password = os.getenv("MYSQL_PASSWORD", "")
        db_name = os.getenv("MYSQL_DB", "aigym")

        return pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=db_name if include_db else None,
            cursorclass=pymysql.cursors.DictCursor
        )

    def _initialize_sync(self):
        # 1. Connect without db to create database if not exists
        host = os.getenv("MYSQL_HOST", "localhost")
        port = int(os.getenv("MYSQL_PORT", 3306))
        user = os.getenv("MYSQL_USER", "root")
        password = os.getenv("MYSQL_PASSWORD", "")
        db_name = os.getenv("MYSQL_DB", "aigym")

        conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password
        )
        try:
            with conn.cursor() as cursor:
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
            conn.commit()
        finally:
            conn.close()

        # 2. Connect with db to create tables
        conn = self._get_raw_connection()
        try:
            with conn.cursor() as cursor:
                # Workouts
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS workouts (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        exercise VARCHAR(100) NOT NULL,
                        reps INT NOT NULL,
                        duration_seconds INT NOT NULL,
                        form_score FLOAT NOT NULL,
                        date VARCHAR(10) NOT NULL,
                        notes TEXT,
                        created_at VARCHAR(30) NOT NULL
                    )
                """)
                # Habits
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS habits (
                        date VARCHAR(10) PRIMARY KEY,
                        water_glasses INT DEFAULT 0,
                        sleep_hours FLOAT DEFAULT 0.0,
                        workout_done BOOLEAN DEFAULT FALSE,
                        steps INT DEFAULT 0,
                        mood VARCHAR(20) DEFAULT 'good',
                        notes TEXT,
                        habits_json TEXT,
                        score INT DEFAULT 0,
                        created_at VARCHAR(30) NOT NULL
                    )
                """)
                # Chat History
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS chat_history (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        conversation_id VARCHAR(50) NOT NULL,
                        user_message TEXT NOT NULL,
                        bot_response TEXT NOT NULL,
                        timestamp VARCHAR(30) NOT NULL
                    )
                """)
            conn.commit()
            self.connected = True
            print(f"[OK] Connected to MySQL database: {db_name}")
        except Exception as e:
            self.connected = False
            print(f"[WARN] MySQL database initialization failed: {e}")
            print("   The app will continue with mock data fallbacks.")
        finally:
            conn.close()

    async def connect(self):
        try:
            await asyncio.to_thread(self._initialize_sync)
        except Exception as e:
            self.connected = False
            print(f"[WARN] Failed to start connection to MySQL: {e}")

    async def close(self):
        # Pymysql connections are created/closed per query, so no persistent client connection is held
        pass

    # --- Database Operations ---

    # 1. Workouts
    def _save_workout_sync(self, workout: dict) -> str:
        conn = self._get_raw_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO workouts (exercise, reps, duration_seconds, form_score, date, notes, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    workout["exercise"],
                    workout["reps"],
                    workout["duration_seconds"],
                    workout["form_score"],
                    workout["date"],
                    workout.get("notes", ""),
                    workout["created_at"]
                ))
                inserted_id = cursor.lastrowid
            conn.commit()
            return str(inserted_id)
        finally:
            conn.close()

    async def save_workout(self, workout: dict) -> str | None:
        if not self.connected:
            return None
        try:
            return await asyncio.to_thread(self._save_workout_sync, workout)
        except Exception as e:
            print(f"[WARN] MySQL save_workout error: {e}")
            return None

    def _get_workouts_sync(self, limit: int) -> list[dict]:
        conn = self._get_raw_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT exercise, reps, duration_seconds, form_score, date, notes, created_at 
                    FROM workouts 
                    ORDER BY created_at DESC 
                    LIMIT %s
                """, (limit,))
                return cursor.fetchall()
        finally:
            conn.close()

    async def get_workouts(self, limit: int = 20) -> list[dict] | None:
        if not self.connected:
            return None
        try:
            return await asyncio.to_thread(self._get_workouts_sync, limit)
        except Exception as e:
            print(f"[WARN] MySQL get_workouts error: {e}")
            return None

    def _get_workouts_since_sync(self, date_str: str) -> list[dict]:
        conn = self._get_raw_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT exercise, reps, duration_seconds, form_score, date, notes, created_at 
                    FROM workouts 
                    WHERE date >= %s
                """, (date_str,))
                return cursor.fetchall()
        finally:
            conn.close()

    async def get_workouts_since(self, date_str: str) -> list[dict] | None:
        if not self.connected:
            return None
        try:
            return await asyncio.to_thread(self._get_workouts_since_sync, date_str)
        except Exception as e:
            print(f"[WARN] MySQL get_workouts_since error: {e}")
            return None

    # 2. Habits
    def _save_habit_sync(self, habit: dict) -> str:
        conn = self._get_raw_connection()
        try:
            # Check if habits_json needs serialization
            habits_json = habit.get("habits")
            if isinstance(habits_json, dict):
                habits_json = json.dumps(habits_json)
            elif habits_json is None:
                habits_json = "{}"

            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO habits (date, water_glasses, sleep_hours, workout_done, steps, mood, notes, habits_json, score, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        water_glasses = VALUES(water_glasses),
                        sleep_hours = VALUES(sleep_hours),
                        workout_done = VALUES(workout_done),
                        steps = VALUES(steps),
                        mood = VALUES(mood),
                        notes = VALUES(notes),
                        habits_json = VALUES(habits_json),
                        score = VALUES(score),
                        created_at = VALUES(created_at)
                """, (
                    habit["date"],
                    habit.get("water_glasses", 0),
                    habit.get("sleep_hours", 0.0),
                    bool(habit.get("workout_done", False)),
                    habit.get("steps", 0),
                    habit.get("mood", "good"),
                    habit.get("notes", ""),
                    habits_json,
                    habit.get("score", 0),
                    habit["created_at"]
                ))
            conn.commit()
            return "updated"
        finally:
            conn.close()

    async def save_habit(self, habit: dict) -> str | None:
        if not self.connected:
            return None
        try:
            return await asyncio.to_thread(self._save_habit_sync, habit)
        except Exception as e:
            print(f"[WARN] MySQL save_habit error: {e}")
            return None

    def _get_habits_sync(self, limit: int) -> list[dict]:
        conn = self._get_raw_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT date, water_glasses, sleep_hours, workout_done, steps, mood, notes, habits_json, score, created_at 
                    FROM habits 
                    ORDER BY date DESC 
                    LIMIT %s
                """, (limit,))
                rows = cursor.fetchall()
                # Deserialize habits_json
                for row in rows:
                    if row.get("habits_json"):
                        try:
                            row["habits"] = json.loads(row["habits_json"])
                        except Exception:
                            row["habits"] = {}
                    else:
                        row["habits"] = {}
                return rows
        finally:
            conn.close()

    async def get_habits(self, limit: int = 30) -> list[dict] | None:
        if not self.connected:
            return None
        try:
            return await asyncio.to_thread(self._get_habits_sync, limit)
        except Exception as e:
            print(f"[WARN] MySQL get_habits error: {e}")
            return None

    # 3. Chat History
    def _save_chat_sync(self, chat_record: dict) -> str:
        conn = self._get_raw_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO chat_history (conversation_id, user_message, bot_response, timestamp)
                    VALUES (%s, %s, %s, %s)
                """, (
                    chat_record["conversation_id"],
                    chat_record["user_message"],
                    chat_record["bot_response"],
                    chat_record["timestamp"]
                ))
                inserted_id = cursor.lastrowid
            conn.commit()
            return str(inserted_id)
        finally:
            conn.close()

    async def save_chat(self, chat_record: dict) -> str | None:
        if not self.connected:
            return None
        try:
            return await asyncio.to_thread(self._save_chat_sync, chat_record)
        except Exception as e:
            print(f"[WARN] MySQL save_chat error: {e}")
            return None


# Module-level database instance shared across the application
db = Database()


async def connect_to_mongo() -> None:
    """Establish connection to database (kept MongoDB name for main.py lifespan compatibility)."""
    await db.connect()


async def close_mongo_connection() -> None:
    """Close connection gracefully (kept MongoDB name for main.py lifespan compatibility)."""
    await db.close()


def get_database():
    """Return the current database instance if connected, else None."""
    return db if db.connected else None
