@echo off
chcp 65001 >nul

set "IDE=C:\Program Files (x86)\Tencent\微信web开发者工具\微信开发者工具.exe"
set "PROJ=%~dp0"
set "APPID=wx5a6b073aba9ffcbe"

echo 牛香香·草原爱宠营 小程序
echo.
echo 正在打开微信开发者工具...

REM Copy path to clipboard
echo %PROJ%| clip

REM Start IDE
start "" "%IDE%"

echo.
echo ============================================
echo IDE已打开，若项目未自动加载：
echo   1. 点左侧 "+" 导入项目
echo   2. 目录粘贴（已复制到剪贴板）
echo   3. AppID填: %APPID%
echo   4. 点"导入"→编译预览→扫码
echo ============================================
echo.
explorer "%PROJ%"
