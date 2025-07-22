/**
 * @jest-environment jsdom
 */

// Simple example test to verify Jest is working
describe('Example Jest Tests', () => {
  test('should pass a basic test', () => {
    expect(true).toBe(true);
  });

  test('should test string operations', () => {
    const str = 'Hello, Jest!';
    expect(str).toContain('Jest');
    expect(str.length).toBeGreaterThan(0);
  });

  test('should test array operations', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).toHaveLength(5);
    expect(arr).toContain(3);
  });

  test('should test object operations', () => {
    const obj = { name: 'Test', value: 42 };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('Test');
  });
});

// Test for DOM manipulation
describe('DOM Manipulation Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-container">
        <h1 id="title">Original Title</h1>
        <button id="test-button">Click Me</button>
      </div>
    `;
  });

  test('should update DOM element text', () => {
    const title = document.getElementById('title');
    title.textContent = 'Updated Title';
    expect(title.textContent).toBe('Updated Title');
  });

  test('should add event listener to button', () => {
    const button = document.getElementById('test-button');
    const mockHandler = jest.fn();
    
    button.addEventListener('click', mockHandler);
    button.click();
    
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
