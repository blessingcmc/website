# Blessings Chinese Medicine Clinic Website

This project is a static website for the Blessings Chinese Medicine Clinic, designed to provide information about the clinic, its practitioners, treatments, and contact details. The website supports both English and Traditional Chinese languages.

## Project Structure

```
blessings-clinic-website
├── src
│   ├── assets
│   │   ├── css
│   │   │   └── styles.css        # CSS styles for the website
│   │   ├── js
│   │   │   └── main.js           # JavaScript functionality for the website
│   │   └── images                # Directory for images used in the website
│   ├── index.html                # Main HTML file with navigation and clinic info
│   ├── practitioners.html         # HTML file for clinic practitioners
│   ├── treatments.html           # HTML file for treatment information
│   ├── contact.html              # HTML file for contact information
│   └── lang
│       ├── en.json               # English localization strings
│       └── zh.json               # Traditional Chinese localization strings
├── .gitignore                    # Git ignore file
├── package.json                  # npm configuration file
└── README.md                     # Project documentation
```

## Features

- **Multi-language Support**: The website includes a language switcher to toggle between English and Traditional Chinese.
- **Responsive Design**: The layout is designed to be user-friendly and accessible on various devices.
- **Dynamic Navigation**: The navigation bar highlights the current section as users scroll through the content.
- **Practitioner Profiles**: Each practitioner has a dedicated page with their photo, information, and links to their personal Instagram accounts.
- **Treatment Information**: Detailed descriptions of the treatments offered by the clinic.
- **Contact Information**: Easy access to the clinic's address, contact number, and photos.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd blessings-clinic-website
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Open `src/index.html` in a web browser to view the website.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.