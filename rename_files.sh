#!/bin/bash

# Script to rename team member files with correct names and positions
# This will rename both PNG and SVG files to use descriptive names

echo "🔄 Renaming team member files with correct names and positions..."

# Define the mapping based on the user's list
declare -A member_mapping=(
    ["1"]="Fady_Maged_Salesforce_Consultant"
    ["2"]="Martin_Ashraf_Salesforce_Consultant"
    ["3"]="Ashraf_Rezk_Head_of_Tech"
    ["4"]="Andrew_Osama_Salesforce_Consultant"
    ["5"]="Mina_Michel_Founder_of_Cloudastick_Systems"
    ["6"]="Luay_Aladin_Salesforce_Consultant"
    ["7"]="Abdullah_Salesforce_Consultant"
    ["8"]="Farida_Esam_Marketing_Cloud_Consultant"
    ["9"]="Mireille_Rafik_Marketing_Cloud_Consultant"
    ["10"]="Carine_Felix_Brand_and_People_Experience_Specialist"
    ["11"]="Shady_Thomas_Salesforce_Consultant"
    ["12"]="Omar_El_Borae_Customer_Success_Manager"
    ["13"]="Andrea_Makary_Technical_Architect"
    ["14"]="Ahmed_Salah_Salesforce_Consultant"
    ["15"]="Mariam_Mamdouh_Project_Manager"
    ["16"]="Maheen_Imran_Salesforce_Consultant"
)

# Rename PNG files
echo "📸 Renaming PNG files..."
for num in "${!member_mapping[@]}"; do
    old_png="public/Assets/Company Members/${num}.png"
    new_png="public/Assets/Company Members/${member_mapping[$num]}.png"
    
    if [ -f "$old_png" ]; then
        mv "$old_png" "$new_png"
        echo "✅ ${num}.png → ${member_mapping[$num]}.png"
    else
        echo "❌ File not found: $old_png"
    fi
done

# Rename SVG files
echo "🎨 Renaming SVG files..."
for num in "${!member_mapping[@]}"; do
    old_svg="public/Assets/Company Members/${num}.svg"
    new_svg="public/Assets/Company Members/${member_mapping[$num]}.svg"
    
    if [ -f "$old_svg" ]; then
        mv "$old_svg" "$new_svg"
        echo "✅ ${num}.svg → ${member_mapping[$num]}.svg"
    else
        echo "❌ File not found: $old_svg"
    fi
done

echo ""
echo "🎉 File renaming complete!"
echo "📁 All files now have descriptive names with member names and positions"
