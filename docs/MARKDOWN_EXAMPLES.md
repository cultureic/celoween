# Markdown Examples for Course Content

This file shows how to use various markdown features in course lessons.

## YouTube Videos

### Method 1: HTML iframe (Recommended)
```html
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/QOCO1G8cJyI" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>
```

### Method 2: Wrapped in div
```html
<div class="video-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/QOCO1G8cJyI" 
    allowfullscreen>
  </iframe>
</div>
```

## Links

### External Links
```markdown
[Visit Celo Docs](https://docs.celo.org)
[Celo GitHub](https://github.com/celo-org)
```

These will automatically:
- Open in a new tab
- Have `rel="noopener noreferrer"` for security
- Be styled with yellow color

### Internal Links
```markdown
[Go to Module 2](/academy/my-course?m=2&s=1)
```

## Images

```markdown
![Celo Logo](https://example.com/celo-logo.png)
```

## Code Blocks with Syntax Highlighting

### JavaScript
```javascript
const contract = new ethers.Contract(address, abi, signer);
await contract.transfer(recipient, amount);
```

### Solidity
```solidity
contract HelloWorld {
    string public message = "Hello, Celo!";
    
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}
```

## Interactive Components

### Callouts
```jsx
<Callout variant="warning" title="Important">
  Always test on Alfajores testnet first!
</Callout>
```

### Tabs
```jsx
<Tabs tabs={[
  { label: 'JavaScript', content: <div>JS code...</div> },
  { label: 'TypeScript', content: <div>TS code...</div> }
]} />
```

### Accordion
```jsx
<Accordion items={[
  { title: 'What is gas?', content: <p>Gas is...</p> }
]} />
```

## Tables

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Mainnet | 42220 | https://forno.celo.org |
| Alfajores | 44787 | https://alfajores-forno.celo-testnet.org |

## Lists

### Unordered
- First item
- Second item
  - Nested item
  - Another nested

### Ordered
1. Connect wallet
2. Select network
3. Sign transaction

## Blockquotes

> "Celo is building a monetary system that creates the conditions for prosperity for everyone." - Celo Foundation

## Horizontal Rule

Use three dashes for a divider:

---

## Emphasis

**Bold text** for strong emphasis
*Italic text* for slight emphasis
~~Strikethrough~~ for corrections
