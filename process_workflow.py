#!/usr/bin/env python3
"""
Enhanced Prompt Workflow Processor
Handles image processing, deployment, archival, and variant detection
"""

import os
import shutil
from pathlib import Path
import re
from datetime import datetime

class PromptWorkflowProcessor:
    def __init__(self):
        self.base_path = Path("C:/Dev/Testing the Agent Swarm")
        self.images_path = self.base_path / "images"
        self.prompts_path = self.base_path / "prompts"
        self.client_assets_path = self.base_path / "client/public/assets"
        self.run_path = self.base_path / "Run"
        
    def get_prompt_filename(self, prompt_file):
        """Get the target filename from first line of prompt file"""
        try:
            with open(prompt_file, 'r', encoding='utf-8') as f:
                return f.readline().strip()
        except:
            return None
    
    def find_matching_images(self, target_filename):
        """Find images that match or relate to the target filename"""
        if not self.images_path.exists():
            return []
        
        matches = []
        target_base = target_filename.replace('.png', '').upper()
        
        for image_file in self.images_path.glob("*.png"):
            image_name = image_file.name.upper()
            
            # Direct match
            if image_name == target_filename.upper():
                matches.append(('exact', image_file))
                continue
                
            # Close match (handles naming variations)
            image_base = image_name.replace('.PNG', '').replace('PNG', '')
            if target_base in image_base or image_base in target_base:
                # Calculate similarity score
                similarity = len(set(target_base.split('_')) & set(image_base.split('_')))
                matches.append(('variant', image_file, similarity))
        
        return matches
    
    def categorize_image(self, filename):
        """Determine the appropriate asset category for an image"""
        filename_upper = filename.upper()
        
        if any(term in filename_upper for term in ['ENEMY', 'BOSS', 'SPRITE', 'WARRIOR', 'MAGE', 'ARCHER', 'ORC', 'GOBLIN', 'DRAGON', 'LICH', 'NECROMANCER', 'SLIME', 'SPIDER', 'SKELETON', 'GARGOYLE', 'VAMPIRE', 'MIMIC', 'GIANT', 'GOLEM']):
            return 'characters'
        elif any(term in filename_upper for term in ['BACKGROUND', 'DUNGEON', 'TEMPLE', 'CAVERN', 'SWAMP', 'TOWER', 'OBSERVATORY', 'VOLCANIC']):
            return 'backgrounds'  
        elif any(term in filename_upper for term in ['WEAPON', 'SWORD', 'BOW', 'STAFF', 'DAGGER', 'HAMMER', 'ARMOR', 'SHIELD']):
            return 'items'
        elif any(term in filename_upper for term in ['SPELL', 'EFFECT', 'TELEPORTATION']):
            return 'effects'
        elif any(term in filename_upper for term in ['POTION', 'RUNE', 'FEATHER', 'ITEM', 'STATUS', 'ICON']):
            return 'items'
        elif any(term in filename_upper for term in ['NPC', 'SCHOLAR', 'PORTRAIT']):
            return 'characters'
        else:
            return 'items'  # Default category
    
    def generate_game_filename(self, original_filename, category):
        """Generate a clean filename for game assets"""
        # Clean up the filename
        clean_name = original_filename.replace('.png', '').replace('png', '')
        clean_name = re.sub(r'[_]+', '-', clean_name.lower())
        clean_name = re.sub(r'^-+|-+$', '', clean_name)
        
        # Add category prefix if needed
        if category == 'backgrounds' and not clean_name.startswith('bg-'):
            clean_name = f"bg-{clean_name}"
        elif category == 'characters' and any(term in clean_name for term in ['enemy', 'boss']):
            pass  # Keep as is for enemies
        elif category == 'items' and any(term in clean_name for term in ['weapon', 'armor']):
            pass  # Keep as is for equipment
        
        return f"{clean_name}.png"
    
    def deploy_image(self, image_path, category):
        """Deploy image to appropriate game assets folder"""
        target_dir = self.client_assets_path / category
        target_dir.mkdir(parents=True, exist_ok=True)
        
        game_filename = self.generate_game_filename(image_path.name, category)
        target_path = target_dir / game_filename
        
        # Handle duplicates by adding variant number
        counter = 1
        while target_path.exists():
            base_name = game_filename.replace('.png', '')
            game_filename = f"{base_name}-v{counter}.png"
            target_path = target_dir / game_filename
            counter += 1
        
        shutil.copy2(image_path, target_path)
        return target_path
    
    def process_workflow(self):
        """Main workflow processing function"""
        print("Enhanced Prompt Workflow Processor")
        print("=" * 50)
        
        # Create batch folder for archival
        batch_name = f"batch_{datetime.now().strftime('%Y-%m-%d-%H')}"
        batch_path = self.run_path / batch_name
        batch_path.mkdir(parents=True, exist_ok=True)
        batch_images_path = batch_path / "images"
        batch_images_path.mkdir(parents=True, exist_ok=True)
        
        processed_images = []
        deployed_images = []
        unmatched_images = []
        
        # Process each prompt
        prompt_files = sorted(self.prompts_path.glob("prompt_*.txt"))
        
        for prompt_file in prompt_files:
            target_filename = self.get_prompt_filename(prompt_file)
            if not target_filename:
                continue
                
            print(f"\nProcessing {prompt_file.name} -> {target_filename}")
            
            # Find matching images
            matches = self.find_matching_images(target_filename)
            
            if matches:
                for match_type, image_path, *extra in matches:
                    category = self.categorize_image(image_path.name)
                    
                    # Deploy to game assets
                    deployed_path = self.deploy_image(image_path, category)
                    deployed_images.append((image_path.name, deployed_path))
                    
                    # Archive original image
                    archive_path = batch_images_path / image_path.name
                    shutil.move(str(image_path), str(archive_path))
                    processed_images.append(image_path.name)
                    
                    match_desc = f"{match_type}" + (f" (similarity: {extra[0]})" if extra else "")
                    print(f"  {match_type.capitalize()} match: {image_path.name} -> {category}/{deployed_path.name}")
                    
                # Archive the prompt
                shutil.copy2(prompt_file, batch_path / prompt_file.name)
                
            else:
                print(f"  No matching images found for {target_filename}")
        
        # Handle unmatched images
        remaining_images = list(self.images_path.glob("*.png"))
        if remaining_images:
            print(f"\nProcessing {len(remaining_images)} unmatched images:")
            for image_path in remaining_images:
                if image_path.name == "_STANDARD_PROMPT_TEMPLATE.png":
                    continue  # Skip template
                    
                category = self.categorize_image(image_path.name)
                deployed_path = self.deploy_image(image_path, category)
                deployed_images.append((image_path.name, deployed_path))
                
                # Archive image
                archive_path = batch_images_path / image_path.name
                shutil.move(str(image_path), str(archive_path))
                unmatched_images.append(image_path.name)
                
                print(f"  Unmatched: {image_path.name} -> {category}/{deployed_path.name}")
        
        # Generate summary report
        print("\n" + "=" * 50)
        print("WORKFLOW PROCESSING SUMMARY")
        print(f"Archive Location: {batch_path}")
        print(f"Processed Images: {len(processed_images)}")
        print(f"Unmatched Images: {len(unmatched_images)}")
        print(f"Total Deployed: {len(deployed_images)}")
        
        # Update asset inventory
        self.update_asset_inventory(deployed_images)
        
        return {
            'batch_path': batch_path,
            'processed_images': processed_images,
            'unmatched_images': unmatched_images,
            'deployed_images': deployed_images
        }
    
    def update_asset_inventory(self, deployed_images):
        """Update the asset inventory tracking"""
        categories = {}
        for original_name, deployed_path in deployed_images:
            category = deployed_path.parent.name
            if category not in categories:
                categories[category] = []
            categories[category].append(deployed_path.name)
        
        print(f"\nUpdated Game Asset Inventory:")
        for category, assets in categories.items():
            print(f"  {category.capitalize()}: +{len(assets)} assets")
            
        # Count total assets
        total_assets = 0
        for category_path in self.client_assets_path.iterdir():
            if category_path.is_dir():
                asset_count = len(list(category_path.glob("*.png")))
                total_assets += asset_count
                print(f"  {category_path.name.capitalize()} Total: {asset_count} assets")
        
        print(f"\nTotal Game Assets: {total_assets}")

if __name__ == "__main__":
    processor = PromptWorkflowProcessor()
    result = processor.process_workflow()