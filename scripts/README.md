# Deployment Scripts

This directory contains automated deployment and monitoring scripts for the Celo Mexico Academy project.

## 📦 Available Scripts

### 1. `monitor-deployment.sh`
Monitor Vercel deployments with real-time status updates.

### 2. `deploy-and-monitor.sh`
Complete deployment workflow: commit, push, and monitor in one command.

---

## 🚀 Quick Start

### Monitor Latest Deployment

```bash
./scripts/monitor-deployment.sh
```

### Deploy with Monitoring

```bash
./scripts/deploy-and-monitor.sh -m "Your commit message"
```

### Deploy with Notifications

```bash
./scripts/deploy-and-monitor.sh -m "Your commit message" -n
```

---

## 📖 Detailed Usage

### Monitor Deployment Script

#### Basic Usage

```bash
# Monitor the latest deployment
./scripts/monitor-deployment.sh

# Monitor with desktop notifications (macOS)
./scripts/monitor-deployment.sh -n

# Monitor specific deployment URL
./scripts/monitor-deployment.sh -u https://celo-xyz.vercel.app

# Watch mode (continuously monitor new deployments)
./scripts/monitor-deployment.sh -w

# Custom timeout (5 minutes)
./scripts/monitor-deployment.sh -t 300

# Verbose output
./scripts/monitor-deployment.sh -v
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-h, --help` | Show help message | - |
| `-w, --watch` | Continuous monitoring mode | false |
| `-t, --timeout SECONDS` | Monitoring timeout | 600 |
| `-n, --notify` | Enable desktop notifications | false |
| `-v, --verbose` | Verbose output | false |
| `-u, --url URL` | Monitor specific deployment | Latest |

#### Features

- ✅ Real-time status updates
- ✅ Progress bar with percentage
- ✅ Color-coded status indicators
- ✅ Desktop notifications (macOS)
- ✅ Automatic timeout handling
- ✅ Watch mode for continuous monitoring
- ✅ Detailed deployment information

#### Status Indicators

- 🟢 **READY** - Deployment completed successfully
- 🟡 **BUILDING** - Deployment in progress
- 🔴 **ERROR** - Deployment failed
- 🔵 **QUEUED** - Deployment queued
- ⚫ **CANCELED** - Deployment canceled

---

### Deploy and Monitor Script

#### Basic Usage

```bash
# Deploy with commit message
./scripts/deploy-and-monitor.sh -m "Fix authentication bug"

# Deploy to specific branch
./scripts/deploy-and-monitor.sh -m "Update" -b develop

# Deploy with notifications and verbose output
./scripts/deploy-and-monitor.sh -m "New feature" -n -v

# Monitor existing deployment (skip commit/push)
./scripts/deploy-and-monitor.sh -s

# Deploy with custom timeout
./scripts/deploy-and-monitor.sh -m "Update" -t 300
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-h, --help` | Show help message | - |
| `-m, --message MESSAGE` | Commit message (required) | - |
| `-b, --branch BRANCH` | Branch to push | main |
| `-n, --notify` | Enable notifications | false |
| `-v, --verbose` | Verbose output | false |
| `-s, --skip-commit` | Skip commit and push | false |
| `-t, --timeout SECONDS` | Monitoring timeout | 600 |

#### Workflow

1. **Pre-deployment Checks**
   - Verify git repository
   - Check Node.js version
   - Validate package.json exists

2. **Commit and Push**
   - Stage all changes
   - Create commit with message
   - Push to specified branch

3. **Monitor Deployment**
   - Wait for Vercel to start
   - Track deployment progress
   - Show real-time status

4. **Summary**
   - Display deployment result
   - Show deployment URL
   - Provide next steps

---

## 💡 Examples

### Example 1: Quick Deployment

```bash
# Make changes to your code
vim app/components/Header.tsx

# Deploy with monitoring
./scripts/deploy-and-monitor.sh -m "Update header styling"
```

### Example 2: Deploy with Notifications

```bash
# Perfect for long-running deployments
./scripts/deploy-and-monitor.sh -m "Major refactor" -n
```

You'll get a desktop notification when the deployment completes!

### Example 3: Watch Mode

```bash
# Monitor all new deployments automatically
./scripts/monitor-deployment.sh -w
```

Keep this running in a terminal to track all deployments as they happen.

### Example 4: Monitor Specific Deployment

```bash
# Check status of a specific deployment
./scripts/monitor-deployment.sh -u https://celo-abc123.vercel.app -v
```

### Example 5: Deploy to Different Branch

```bash
# Deploy to staging/preview branch
./scripts/deploy-and-monitor.sh -m "Test new feature" -b develop
```

---

## 🎨 Visual Output

### Monitor Script Output

```
╔════════════════════════════════════════════════════════════════╗
║           VERCEL DEPLOYMENT MONITOR                            ║
╚════════════════════════════════════════════════════════════════╝

Project:     celo-mx
URL:         https://celo-g6dzmsws0-aszalvarezgmailcoms-projects.vercel.app
Timeout:     600s
Started:     Tue Oct  7 10:00:00 2025

⏳ Status: BUILDING
[████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  35%

✓ Status: READY
[██████████████████████████████████████████████████] 100%

[10:05:23] ✓ Deployment completed successfully!

Deployment URL: https://celo-g6dzmsws0-aszalvarezgmailcoms-projects.vercel.app
```

### Deploy Script Output

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🚀  DEPLOY & MONITOR WORKFLOW  🚀                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

[10:00:15] ℹ Running pre-deployment checks...
[10:00:15] Node.js version: v20.19.4
[10:00:15] ✓ Pre-deployment checks passed

[10:00:16] ℹ Staging all changes...
[10:00:16] ℹ Creating commit...
[10:00:16] ✓ Commit created: Update header styling

[10:00:17] ℹ Pushing to remote branch: main
[10:00:19] ✓ Successfully pushed to origin/main

[10:00:19] ℹ Starting deployment monitoring...
[10:00:24] ℹ Fetching latest deployment...

... monitoring output ...

═══════════════════════════════════════════════════════════════

✓ DEPLOYMENT SUCCESSFUL

Branch:  main
Status:  Ready

═══════════════════════════════════════════════════════════════
```

---

## 🔧 Configuration

### Environment Variables

Both scripts support the following environment variables:

```bash
# Optional: Vercel authentication token
export VERCEL_TOKEN="your-token-here"
```

### Default Settings

You can modify default settings by editing the scripts:

**monitor-deployment.sh:**
```bash
TIMEOUT=600        # 10 minutes
POLL_INTERVAL=5    # Check every 5 seconds
```

**deploy-and-monitor.sh:**
```bash
BRANCH="main"      # Default branch
TIMEOUT=600        # 10 minutes
```

---

## 📱 Desktop Notifications (macOS)

Enable desktop notifications with the `-n` flag:

```bash
./scripts/deploy-and-monitor.sh -m "Update" -n
```

Notifications are sent for:
- ✅ Successful deployments
- ❌ Failed deployments
- ⏱️ Deployment timeouts
- 🚫 Canceled deployments

---

## 🐛 Troubleshooting

### Script Not Executable

```bash
chmod +x scripts/monitor-deployment.sh
chmod +x scripts/deploy-and-monitor.sh
```

### Vercel CLI Not Found

```bash
npm install -g vercel
vercel login
```

### Git Repository Issues

```bash
# Verify you're in a git repository
git status

# Check remote configuration
git remote -v
```

### Node Version Issues

```bash
# Check current Node.js version
node --version

# Switch to compatible version (using nvm)
nvm use 20
```

---

## 🚨 Error Handling

Both scripts include comprehensive error handling:

- **Exit Code 0**: Success
- **Exit Code 1**: Deployment failed
- **Exit Code 2**: Deployment canceled
- **Exit Code 3**: Timeout reached
- **Exit Code 130**: User interrupted (Ctrl+C)

### Example Error Messages

```bash
[10:00:15] ✗ Vercel CLI not found. Please install it:
  npm install -g vercel

[10:00:20] ✗ Not a git repository

[10:00:25] ⚠ Timeout reached after 600s
```

---

## 🔗 Integration with npm scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "deploy": "./scripts/deploy-and-monitor.sh",
    "deploy:watch": "./scripts/monitor-deployment.sh -w",
    "deploy:notify": "./scripts/deploy-and-monitor.sh -n"
  }
}
```

Then use:

```bash
npm run deploy -- -m "Your commit message"
npm run deploy:watch
npm run deploy:notify -- -m "Important update"
```

---

## 📋 Deployment Checklist

Before using these scripts, ensure:

- [ ] Vercel CLI is installed and authenticated
- [ ] Git repository is properly configured
- [ ] Node.js version is compatible (v20+)
- [ ] Environment variables are set in Vercel
- [ ] You're on the correct git branch
- [ ] All changes are ready to be committed

---

## 🎯 Best Practices

### 1. Use Descriptive Commit Messages

```bash
# Good
./scripts/deploy-and-monitor.sh -m "feat: Add user authentication"
./scripts/deploy-and-monitor.sh -m "fix: Resolve database connection issue"

# Avoid
./scripts/deploy-and-monitor.sh -m "update"
./scripts/deploy-and-monitor.sh -m "changes"
```

### 2. Enable Notifications for Long Deployments

```bash
# For deployments that might take a while
./scripts/deploy-and-monitor.sh -m "Major refactor" -n -t 900
```

### 3. Use Watch Mode for Active Development

```bash
# Keep this running during development
./scripts/monitor-deployment.sh -w -n
```

### 4. Monitor Specific Deployments

```bash
# If you need to check a specific deployment
./scripts/monitor-deployment.sh -u <deployment-url> -v
```

---

## 📊 Performance Tips

- **Poll Interval**: Default 5 seconds balances responsiveness and API usage
- **Timeout**: Set appropriately based on project size (600s default)
- **Watch Mode**: Use sparingly to avoid excessive API calls
- **Notifications**: Enable only when needed to avoid notification spam

---

## 🔐 Security Notes

- Never commit scripts with hardcoded tokens
- Use environment variables for sensitive data
- Keep Vercel CLI updated for security patches
- Review deployment logs for sensitive information

---

## 🤝 Contributing

To improve these scripts:

1. Test your changes thoroughly
2. Update this README with new features
3. Follow the existing code style
4. Add comments for complex logic

---

## 📚 Additional Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Git Documentation](https://git-scm.com/doc)
- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)

---

## 📄 License

These scripts are part of the Celo Mexico Academy project.

---

**Last Updated**: 2025-10-07  
**Maintained By**: Celo Mexico Team  
**Version**: 1.0.0
