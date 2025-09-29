#!/bin/bash

# Script to optimize SVG files and convert them to PNG for faster loading
# This will significantly reduce file sizes and improve loading performance

echo "🖼️  Starting image optimization process..."

# Create optimized directory
mkdir -p "public/Assets/Company Members/Optimized"

# List of SVG files to optimize
svg_files=(
    "1.svg" "2.svg" "3.svg" "4.svg" "5.svg" "6.svg" "8.svg" "10.svg" 
    "11.svg" "12.svg" "13.svg" "14.svg" "15.svg" "16.svg" "18.svg" "19.svg" "20.svg"
)

# Process each SVG file
for svg_file in "${svg_files[@]}"; do
    input_path="public/Assets/Company Members/$svg_file"
    output_png="public/Assets/Company Members/Optimized/${svg_file%.svg}.png"
    
    if [ -f "$input_path" ]; then
        echo "📸 Processing $svg_file..."
        
        # Get original file size
        original_size=$(ls -lh "$input_path" | awk '{print $5}')
        
        # Convert SVG to PNG with optimization
        # -density 300: High quality for web
        # -resize 400x400: Standardize size
        # -quality 85: Good balance of quality/size
        # -strip: Remove metadata
        magick "$input_path" -density 300 -resize 400x400 -quality 85 -strip "$output_png"
        
        # Get optimized file size
        optimized_size=$(ls -lh "$output_png" | awk '{print $5}')
        
        echo "✅ $svg_file: $original_size → $optimized_size"
    else
        echo "❌ File not found: $input_path"
    fi
done

echo ""
echo "🎉 Image optimization complete!"
echo "📁 Optimized images saved to: public/Assets/Company Members/Optimized/"
echo ""
echo "📊 Summary:"
echo "Original SVG files: $(ls -1 public/Assets/Company\ Members/*.svg | wc -l) files"
echo "Optimized PNG files: $(ls -1 public/Assets/Company\ Members/Optimized/*.png | wc -l) files"
echo ""
echo "💡 Next step: Update the React components to use the optimized PNG files"
