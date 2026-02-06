#!/usr/bin/env python3
"""
Dark Mode Converter Script
Applies consistent dark mode classes to React components
"""

import re
import os
import glob

def add_dark_mode_classes(content: str) -> str:
    """Add dark mode Tailwind classes to component content"""
    
    # Define replacement patterns
    replacements = [
        # Backgrounds
        (r'className="bg-white\s', 'className="bg-white dark:bg-gray-800 '),
        (r'className="bg-white"', 'className="bg-white dark:bg-gray-800"'),
        (r'\sbg-white\s', ' bg-white dark:bg-gray-800 '),
        (r'\sbg-white"', ' bg-white dark:bg-gray-800"'),
        
        (r'className="bg-gray-50\s', 'className="bg-gray-50 dark:bg-gray-700 '),
        (r'className="bg-gray-50"', 'className="bg-gray-50 dark:bg-gray-700"'),
        (r'\sbg-gray-50\s', ' bg-gray-50 dark:bg-gray-700 '),
        (r'\sbg-gray-50"', ' bg-gray-50 dark:bg-gray-700"'),
        
        # Text colors
        (r'\stext-gray-900\s', ' text-gray-900 dark:text-white '),
        (r'\stext-gray-900"', ' text-gray-900 dark:text-white"'),
        
        (r'\stext-gray-800\s', ' text-gray-800 dark:text-white '),
        (r'\stext-gray-800"', ' text-gray-800 dark:text-white"'),
        
        (r'\stext-gray-700\s', ' text-gray-700 dark:text-gray-300 '),
        (r'\stext-gray-700"', ' text-gray-700 dark:text-gray-300"'),
        
        (r'\stext-gray-600\s', ' text-gray-600 dark:text-gray-400 '),
        (r'\stext-gray-600"', ' text-gray-600 dark:text-gray-400"'),
        
        # Borders
        (r'\sborder-gray-200\s', ' border-gray-200 dark:border-gray-700 '),
        (r'\sborder-gray-200"', ' border-gray-200 dark:border-gray-700"'),
        
        (r'\sborder-gray-300\s', ' border-gray-300 dark:border-gray-600 '),
        (r'\sborder-gray-300"', ' border-gray-300 dark:border-gray-600"'),
        
        # Dividers
        (r'\sdivide-gray-200\s', ' divide-gray-200 dark:divide-gray-700 '),
        (r'\sdivide-gray-200"', ' divide-gray-200 dark:divide-gray-700"'),
        
        # Hover states
        (r'\shover:bg-gray-50\s', ' hover:bg-gray-50 dark:hover:bg-gray-700 '),
        (r'\shover:bg-gray-50"', ' hover:bg-gray-50 dark:hover:bg-gray-700"'),
        
        (r'\shover:bg-gray-100\s', ' hover:bg-gray-100 dark:hover:bg-gray-700 '),
        (r'\shover:bg-gray-100"', ' hover:bg-gray-100 dark:hover:bg-gray-700"'),
    ]
    
    result = content
    for pattern, replacement in replacements:
        # Skip if dark: is already present in the vicinity
        matches = re.finditer(pattern, result)
        for match in matches:
            start = max(0, match.start() - 50)
            end = min(len(result), match.end() + 50)
            context = result[start:end]
            if 'dark:' not in context:
                result = re.sub(pattern, replacement, result, count=1)
    
    return result

def main():
    pages_dir = "src/app/components/pages"
    
    if not os.path.exists(pages_dir):
        print(f"Directory {pages_dir} not found")
        return
    
    tsx_files = glob.glob(f"{pages_dir}/*.tsx")
    
    for file_path in tsx_files:
        filename = os.path.basename(file_path)
        
        # Skip if already processed (Dashboard, Settings)
        if filename in ['DashboardPage.tsx', 'SettingsPage.tsx']:
            continue
            
        print(f"Processing {filename}...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated_content = add_dark_mode_classes(content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"✓ Updated {filename}")

if __name__ == '__main__':
    main()
