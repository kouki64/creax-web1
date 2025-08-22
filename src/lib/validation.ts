// メールアドレスの形式チェック
export const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  
  // パスワード強度チェック
  export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('8文字以上必要です');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('大文字を含む必要があります');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('小文字を含む必要があります');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('数字を含む必要があります');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  // パスワード強度を取得
  export const getPasswordStrength = (password: string): {
    level: 'weak' | 'medium' | 'strong';
    percentage: number;
  } => {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    
    if (strength < 50) {
      return { level: 'weak', percentage: strength };
    } else if (strength < 80) {
      return { level: 'medium', percentage: strength };
    } else {
      return { level: 'strong', percentage: strength };
    }
  };