@echo off
echo ============================================
echo Bakery App - Database Migration
echo ============================================
echo.

set /p DB_USER="Enter MySQL username (default: root): "
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASS="Enter MySQL password: "

echo.
echo Running migration...
echo.

mysql -u %DB_USER% -p%DB_PASS% bakery_db < database_migration.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo Migration completed successfully!
    echo ============================================
    echo.
    echo Next steps:
    echo 1. Restart your Spring Boot backend
    echo 2. Test item deletion
    echo.
) else (
    echo.
    echo ============================================
    echo Migration failed!
    echo ============================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Database 'bakery_db' exists
    echo 3. Username and password are correct
    echo.
)

pause
