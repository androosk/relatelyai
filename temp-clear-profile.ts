// Temporary script to clear profile for testing onboarding
// Run this in your browser console while logged in, or create a temporary button

import { profileService } from './components/services/profileService';

// Clear first_name to trigger onboarding
async function resetOnboarding() {
  try {
    await profileService.updateProfile({
      first_name: null,
    });
    console.log('Profile cleared - reload app to see onboarding');
  } catch (error) {
    console.error('Error:', error);
  }
}

resetOnboarding();