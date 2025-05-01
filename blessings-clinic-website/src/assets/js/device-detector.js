/**
 * Device detector utility
 * Helps detect mobile devices and provides appropriate UI components
 */

class DeviceDetector {
    constructor() {
        this.isMobile = this.checkIfMobile();
        this.isIOS = this.checkIfIOS();
        this.isAndroid = this.checkIfAndroid();
        this.isSafari = this.checkIfSafari();
    }

    /**
     * Check if the current device is a mobile device
     * @returns {boolean} True if mobile device
     */
    checkIfMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768);
    }

    /**
     * Check if the current device is running iOS
     * @returns {boolean} True if iOS device
     */
    checkIfIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    /**
     * Check if the current device is running Android
     * @returns {boolean} True if Android device
     */
    checkIfAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    /**
     * Check if the current browser is Safari
     * @returns {boolean} True if Safari browser
     */
    checkIfSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
}

// Create a global device detector instance
const deviceDetector = new DeviceDetector();

// Export the device detector
window.deviceDetector = deviceDetector;
