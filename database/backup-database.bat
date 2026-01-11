@echo off
REM ========================================
REM Bakery App - Database Backup Script
REM ========================================

setlocal

REM Configuration
set DB_NAME=bakery_db
set DB_USER=root
set DB_PASSWORD=root
set BACKUP_DIR=C:\GaMes\BakeryApp\database\backups
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_FILE=%BACKUP_DIR%\bakery_db_%TIMESTAMP%.sql

REM Create backup directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo ========================================
echo Bakery Database Backup
echo ========================================
echo.
echo Database: %DB_NAME%
echo Backup File: %BACKUP_FILE%
echo.

REM Perform backup
echo Creating backup...
mysqldump -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% > "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Backup completed successfully!
    echo ========================================
    echo File: %BACKUP_FILE%
    echo Size: 
    dir "%BACKUP_FILE%" | find "%TIMESTAMP%"
) else (
    echo.
    echo ========================================
    echo Backup FAILED!
    echo ========================================
    echo Please check your MySQL credentials and database name.
)

echo.
echo Cleaning up old backups (keeping last 30 days)...
forfiles /P "%BACKUP_DIR%" /M *.sql /D -30 /C "cmd /c del @path" 2>nul

echo.
pause
