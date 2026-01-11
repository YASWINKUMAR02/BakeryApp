@echo off
REM ========================================
REM Bakery App - Database Restore Script
REM ========================================

setlocal

REM Configuration
set DB_NAME=bakery_db
set DB_USER=root
set DB_PASSWORD=root
set BACKUP_DIR=C:\GaMes\BakeryApp\database\backups

echo ========================================
echo Bakery Database Restore
echo ========================================
echo.
echo Available backups:
echo.
dir /B "%BACKUP_DIR%\*.sql"
echo.
set /p BACKUP_FILE="Enter backup filename (or full path): "

REM Check if file exists
if not exist "%BACKUP_FILE%" (
    if not exist "%BACKUP_DIR%\%BACKUP_FILE%" (
        echo Error: Backup file not found!
        pause
        exit /b 1
    )
    set BACKUP_FILE=%BACKUP_DIR%\%BACKUP_FILE%
)

echo.
echo WARNING: This will replace all data in database '%DB_NAME%'
echo.
set /p CONFIRM="Are you sure you want to continue? (yes/no): "

if /i not "%CONFIRM%"=="yes" (
    echo Restore cancelled.
    pause
    exit /b 0
)

echo.
echo Restoring database from: %BACKUP_FILE%
echo.

REM Restore database
mysql -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Restore completed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Restore FAILED!
    echo ========================================
    echo Please check your MySQL credentials and backup file.
)

echo.
pause
