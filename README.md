# StudySpot – Study Space Reservation App

## 1. Project Overview

StudySpot is a mobile application developed using Expo React Native and TypeScript. It helps students explore available study spaces, check occupancy, and reserve a study space for their preferred time slot.

## 2. Features

- Student login using full name and section.
- Explore study spaces grouped by building.
- Search and filter study spaces.
- View study space occupancy.
- Add and remove favorite spaces.
- Best Match Right Now recommendation.
- View study space details and amenities.
- Book a study space and select a time slot.
- View and cancel bookings.
- View student profile and booking statistics.
- Responsive layout for different screen sizes.

## 3. Navigation Structure

StudySpot uses React Navigation with a native stack navigator and bottom tab navigator.

### Stack Navigation
- Login
- Main
- SpaceDetails
- Booking

### Bottom Tab Navigation
- Explore
- Bookings
- Profile

## 4. Route Parameters

The application uses TypeScript for navigation parameter definitions.

- **SpaceDetails:** Receives `spaceId` to identify the selected study space.
- **Booking:** Receives `spaceId` to identify the study space being reserved.
- **Login and Main:** Do not require route parameters.

## 5. Innovation Feature: Best Match Right Now

The Best Match Right Now feature recommends an available Quiet study space with the lowest occupancy.

The recommendation changes when the available spaces or applied filters change. If no suitable space is available, the application displays a message.

## 6. Additional Enhancement: Booking Conflict Prevention

The application prevents duplicate bookings for the same study space, date, and time slot. This helps avoid reservation conflicts.

## 7. Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- Expo Vector Icons
- JavaScript
- StyleSheet

## 8. Installation and Setup

### Requirements
- Node.js and npm
- Visual Studio Code
- Expo Go or an emulator

### Installation Steps

1. Clone or download the repository.
2. Open the project folder in Visual Studio Code.
3. Open the terminal.
4. Install the dependencies:

   ```bash
   npm install
   ```

5. Start the Expo development server:

   ```bash
   npx expo start
   ```

6. Scan the QR code using Expo Go or open the application using an emulator.

## 9. Screenshots

Add screenshots of the working application inside a folder named `screenshots`.

Suggested screenshots:

- Login Screen
- Explore Screen
- Space Details or Booking Screen

Example:

![Login Screen](screenshots/login.png)

![Explore Screen](screenshots/explore.png)

![Booking Screen](screenshots/booking.png)

## 10. Data Storage

StudySpot uses React state to manage user information, favorites, and bookings while the application is running. It does not use a backend database.

## 11. Author Information

**Name:** Jassel Raica A. Sabit 
**Course:** IT 313  
**Project:** Performance Task – Modules 6–9  
**Application:** StudySpot

## 12. GitHub Repository

https://github.com/sabitjassel/IT313_LastName_FirstName_StudySpot
