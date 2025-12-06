/**
 * Accessibility audit utility for automated testing
 */

/**
 * Check if an element has proper ARIA attributes
 * @param {HTMLElement} element - The element to check
 * @returns {Object} Audit results
 */
export const auditAriaAttributes = (element) => {
  const results = {
    passed: true,
    issues: [],
    warnings: []
  };

  // Check for proper ARIA labels
  const hasAriaLabel = element.hasAttribute('aria-label');
  const hasAriaLabelledby = element.hasAttribute('aria-labelledby');
  const hasAlt = element.hasAttribute('alt');

  if (element.tagName === 'IMG' && !hasAlt) {
    results.passed = false;
    results.issues.push('Image missing alt attribute');
  }

  if (element.tagName === 'BUTTON' && !hasAriaLabel && !hasAriaLabelledby && !element.textContent.trim()) {
    results.passed = false;
    results.issues.push('Button missing accessible name');
  }

  // Check for proper ARIA roles
  const role = element.getAttribute('role');
  if (role && !isValidRole(role)) {
    results.warnings.push(`Invalid ARIA role: ${role}`);
  }

  return results;
};

/**
 * Check if a role is valid
 * @param {string} role - The role to validate
 * @returns {boolean} Whether the role is valid
 */
const isValidRole = (role) => {
  const validRoles = [
    'button', 'checkbox', 'dialog', 'gridcell', 'link', 'menuitem',
    'menuitemcheckbox', 'menuitemradio', 'option', 'progressbar',
    'radio', 'scrollbar', 'searchbox', 'slider', 'spinbutton', 'switch',
    'tab', 'tabpanel', 'textbox', 'treeitem', 'combobox', 'grid',
    'listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree',
    'treegrid', 'article', 'banner', 'complementary', 'contentinfo',
    'form', 'main', 'navigation', 'region', 'search', 'section',
    'sectionhead', 'alert', 'alertdialog', 'application', 'log',
    'marquee', 'status', 'timer', 'toolbar', 'tooltip'
  ];
  return validRoles.includes(role);
};

/**
 * Check color contrast ratio
 * @param {string} foregroundColor - Foreground color (hex)
 * @param {string} backgroundColor - Background color (hex)
 * @returns {Object} Contrast results
 */
export const checkColorContrast = (foregroundColor, backgroundColor) => {
  const results = {
    ratio: 0,
    passes: {
      AA: false,
      AAA: false
    },
    issues: []
  };

  // Convert hex to RGB
  const fg = hexToRgb(foregroundColor);
  const bg = hexToRgb(backgroundColor);

  if (!fg || !bg) {
    results.issues.push('Invalid color format');
    return results;
  }

  // Calculate relative luminance
  const fgLuminance = calculateRelativeLuminance(fg);
  const bgLuminance = calculateRelativeLuminance(bg);

  // Calculate contrast ratio
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  results.ratio = (lighter + 0.05) / (darker + 0.05);

  // Check WCAG compliance
  results.passes.AA = results.ratio >= 4.5;
  results.passes.AAA = results.ratio >= 7;

  if (!results.passes.AA) {
    results.issues.push(`Contrast ratio ${results.ratio.toFixed(2)}:1 does not meet WCAG AA standards (4.5:1)`);
  }

  return results;
};

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string
 * @returns {Object|null} RGB object or null if invalid
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculate relative luminance
 * @param {Object} rgb - RGB color object
 * @returns {number} Relative luminance
 */
const calculateRelativeLuminance = (rgb) => {
  const { r, g, b } = rgb;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Check heading hierarchy
 * @param {HTMLElement} container - Container element
 * @returns {Object} Heading hierarchy results
 */
export const auditHeadingHierarchy = (container) => {
  const results = {
    passed: true,
    issues: [],
    headings: []
  };

  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent.trim();
    
    results.headings.push({ level, text, element: heading });
    
    // Check for skipped levels
    if (index > 0) {
      const prevLevel = results.headings[index - 1].level;
      if (level > prevLevel + 1) {
        results.passed = false;
        results.issues.push(`Heading level skipped: h${prevLevel} → h${level}`);
      }
    }
  });

  // Check for multiple h1 elements
  const h1Elements = results.headings.filter(h => h.level === 1);
  if (h1Elements.length > 1) {
    results.passed = false;
    results.issues.push(`Multiple h1 elements found: ${h1Elements.length}`);
  }

  return results;
};

/**
 * Check keyboard navigation
 * @param {HTMLElement} container - Container element
 * @returns {Object} Keyboard navigation results
 */
export const auditKeyboardNavigation = (container) => {
  const results = {
    passed: true,
    issues: [],
    focusableElements: []
  };

  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]'
  ];

  const focusableElements = container.querySelectorAll(focusableSelectors.join(', '));
  
  focusableElements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const tabIndex = element.getAttribute('tabindex');
    const hasFocusVisible = element.classList.contains('focus-visible') || 
                           getComputedStyle(element).outline !== 'none';
    
    results.focusableElements.push({
      element,
      tagName,
      role,
      tabIndex,
      hasFocusVisible,
      index
    });

    // Check for focus indicators
    if (!hasFocusVisible) {
      results.issues.push(`Focusable element missing visible focus indicator: ${tagName}`);
    }

    // Check for proper tabindex
    if (tabIndex && !['0', '-1'].includes(tabIndex)) {
      results.warnings.push(`Non-standard tabindex value: ${tabIndex}`);
    }
  });

  if (results.issues.length > 0) {
    results.passed = false;
  }

  return results;
};

/**
 * Check form accessibility
 * @param {HTMLElement} container - Container element
 * @returns {Object} Form accessibility results
 */
export const auditFormAccessibility = (container) => {
  const results = {
    passed: true,
    issues: [],
    forms: []
  };

  const forms = container.querySelectorAll('form');
  
  forms.forEach((form, formIndex) => {
    const formResult = {
      element: form,
      inputs: [],
      issues: []
    };

    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input) => {
      const inputResult = {
        element: input,
        type: input.type,
        hasLabel: false,
        hasAriaLabel: false,
        hasAriaLabelledby: false,
        isRequired: input.hasAttribute('required') || input.hasAttribute('aria-required'),
        hasError: input.hasAttribute('aria-invalid')
      };

      // Check for labels
      const id = input.getAttribute('id');
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
          inputResult.hasLabel = true;
        }
      }

      // Check for ARIA labels
      if (input.hasAttribute('aria-label')) {
        inputResult.hasAriaLabel = true;
      }
      if (input.hasAttribute('aria-labelledby')) {
        inputResult.hasAriaLabelledby = true;
      }

      // Check for accessibility issues
      if (!inputResult.hasLabel && !inputResult.hasAriaLabel && !inputResult.hasAriaLabelledby) {
        inputResult.issues.push('Input missing accessible name');
        formResult.issues.push(`Input missing accessible name: ${input.type}`);
      }

      formResult.inputs.push(inputResult);
    });

    results.forms.push(formResult);
    
    if (formResult.issues.length > 0) {
      results.passed = false;
      results.issues.push(...formResult.issues);
    }
  });

  return results;
};

/**
 * Comprehensive accessibility audit
 * @param {HTMLElement} container - Container element to audit
 * @returns {Object} Complete audit results
 */
export const runAccessibilityAudit = (container) => {
  const results = {
    timestamp: new Date().toISOString(),
    passed: true,
    summary: {
      totalIssues: 0,
      totalWarnings: 0,
      criticalIssues: 0
    },
    sections: {}
  };

  // Run individual audits
  results.sections.headings = auditHeadingHierarchy(container);
  results.sections.keyboard = auditKeyboardNavigation(container);
  results.sections.forms = auditFormAccessibility(container);

  // Aggregate results
  Object.values(results.sections).forEach(section => {
    if (!section.passed) {
      results.passed = false;
    }
    results.summary.totalIssues += section.issues.length;
    results.summary.totalWarnings += section.warnings?.length || 0;
  });

  return results;
};

/**
 * Generate accessibility report
 * @param {Object} auditResults - Results from runAccessibilityAudit
 * @returns {string} Formatted report
 */
export const generateAccessibilityReport = (auditResults) => {
  const { passed, summary, sections } = auditResults;
  
  let report = `Accessibility Audit Report\n`;
  report += `Generated: ${auditResults.timestamp}\n`;
  report += `Overall Status: ${passed ? 'PASSED' : 'FAILED'}\n\n`;
  
  report += `Summary:\n`;
  report += `- Total Issues: ${summary.totalIssues}\n`;
  report += `- Total Warnings: ${summary.totalWarnings}\n`;
  report += `- Critical Issues: ${summary.criticalIssues}\n\n`;

  Object.entries(sections).forEach(([sectionName, section]) => {
    report += `${sectionName.toUpperCase()}:\n`;
    report += `Status: ${section.passed ? 'PASSED' : 'FAILED'}\n`;
    
    if (section.issues.length > 0) {
      report += `Issues:\n`;
      section.issues.forEach(issue => {
        report += `- ${issue}\n`;
      });
    }
    
    if (section.warnings && section.warnings.length > 0) {
      report += `Warnings:\n`;
      section.warnings.forEach(warning => {
        report += `- ${warning}\n`;
      });
    }
    
    report += `\n`;
  });

  return report;
};

export default {
  auditAriaAttributes,
  checkColorContrast,
  auditHeadingHierarchy,
  auditKeyboardNavigation,
  auditFormAccessibility,
  runAccessibilityAudit,
  generateAccessibilityReport
};
