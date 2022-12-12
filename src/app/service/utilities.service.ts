import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {  
  constructor() {
    
  }

  /**
   * انتقال به تکست باکس بعدی بعد از وارد کردن مقدار
   * @param element
   */
  public onFocusElement(element: any): void {
    setTimeout(() => {
      element.focus();
    }, 1);
  }

  /**
   * convert Base64 to Blob
   * @param base64Image
   */
  public convertBase64ToBlob(base64Image: string) {
    // Split into two parts
    const parts = base64Image.split(';base64,');

    // Hold the content type
    const imageType = parts[0].split(':')[1];

    // Decode Base64 string
    const decodedData = window.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }

  /**
   * Validation char for persian or english or number
   * @param char
   * @param type
   */
  public isValidationChart(char: string, type: 'fa' | 'en' | 'number'): boolean {
    if (!!char) {
      switch (type) {
        case 'fa':
          break;
        case 'en':
          // check a-z character
          return (!/[^a-zA-Z0-9]/.test(char));
        case 'number':
          return (!/[^0-9]/.test(char));
      }
    }
    return false;
  }


  // convert persian number to english number
  public convertFaToEnNumber(value: string): string {
    return value.replace(/[\u06F0-\u06F9]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) - 1728);
    });
  }

  // check text is only number
  public isNumber(value: string): boolean {
    return /^\d+$/.test(value);
  }
  

  // convert base64 to file
  public convertBase64ToFile(base64: string, fileName: string = "test"): File {
    const blob = this.convertBase64ToBlob(base64);
    return new File([blob], fileName, { type: 'image/png' });
  }


  // check guid is valid regex
  public isValidGuid(guid: string): boolean {
    var result = guid.match("^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$");
    return result.length > 0;
  }
    
}
