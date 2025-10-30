#!/bin/bash

# =============================================================================
# Deploy and Monitor Script
# =============================================================================
# This script combines git push with Vercel deployment monitoring
# 
# Usage:
#   ./scripts/deploy-and-monitor.sh [options]
#
# Options:
#   -h, --help          Show this help message
#   -m, --message MSG   Commit message (required if there are changes)
#   -b, --branch NAME   Branch to push (default: main)
#   -n, --notify        Enable desktop notifications
#   -v, --verbose       Verbose output
#   -s, --skip-commit   Skip commit and push (monitor only)
#   -t, --timeout SEC   Monitoring timeout in seconds (default: 600)
#
# Examples:
#   ./scripts/deploy-and-monitor.sh -m "Fix bug"
#   ./scripts/deploy-and-monitor.sh -m "New feature" -n
#   ./scripts/deploy-and-monitor.sh -s                 # Monitor only
# =============================================================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
COMMIT_MESSAGE=""
BRANCH="main"
NOTIFY=false
VERBOSE=false
SKIP_COMMIT=false
TIMEOUT=600

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
    cat << EOF
${BOLD}Deploy and Monitor Script${NC}

Combine git push with Vercel deployment monitoring.

${BOLD}USAGE:${NC}
    $0 [OPTIONS]

${BOLD}OPTIONS:${NC}
    -h, --help                  Show this help message
    -m, --message MESSAGE       Commit message (required if changes exist)
    -b, --branch BRANCH         Branch to push (default: main)
    -n, --notify                Enable desktop notifications
    -v, --verbose               Verbose output
    -s, --skip-commit           Skip commit and push (monitor only)
    -t, --timeout SECONDS       Monitoring timeout (default: 600)

${BOLD}EXAMPLES:${NC}
    $0 -m "Fix authentication bug"
    $0 -m "Add new feature" -n -v
    $0 -s                           # Just monitor existing deployment
    $0 -m "Update" -b develop       # Push to develop branch

EOF
}

log() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✓${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠${NC} $1"
}

log_info() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] ℹ${NC} $1"
}

show_banner() {
    echo ""
    echo -e "${BOLD}${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${CYAN}║                                                               ║${NC}"
    echo -e "${BOLD}${CYAN}║              🚀  DEPLOY & MONITOR WORKFLOW  🚀                ║${NC}"
    echo -e "${BOLD}${CYAN}║                                                               ║${NC}"
    echo -e "${BOLD}${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_git_status() {
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        return 0  # Changes exist
    else
        return 1  # No changes
    fi
}

check_git_repo() {
    if ! git rev-parse --is-inside-work-tree &>/dev/null; then
        log_error "Not a git repository"
        exit 1
    fi
}

stage_and_commit() {
    local message=$1
    
    log_info "Staging all changes..."
    git add -A
    
    if check_git_status; then
        log_info "Creating commit..."
        git commit -m "$message"
        log_success "Commit created: $message"
        return 0
    else
        log_warning "No changes to commit"
        return 1
    fi
}

push_to_remote() {
    local branch=$1
    
    log_info "Pushing to remote branch: $branch"
    
    if git push origin "$branch"; then
        log_success "Successfully pushed to origin/$branch"
        return 0
    else
        log_error "Failed to push to origin/$branch"
        return 1
    fi
}

run_pre_deployment_checks() {
    echo ""
    log_info "Running pre-deployment checks..."
    
    # Check Node.js version
    local node_version=$(node --version)
    log "Node.js version: $node_version"
    
    # Check for package.json
    if [[ ! -f "package.json" ]]; then
        log_error "package.json not found"
        exit 1
    fi
    
    # Check for critical environment files
    if [[ ! -f ".env.local" ]] && [[ ! -f ".env" ]]; then
        log_warning "No .env files found - environment variables should be set in Vercel"
    fi
    
    log_success "Pre-deployment checks passed"
}

monitor_deployment() {
    local monitor_script="$SCRIPT_DIR/monitor-deployment.sh"
    
    if [[ ! -f "$monitor_script" ]]; then
        log_error "Monitor script not found: $monitor_script"
        exit 1
    fi
    
    # Make sure it's executable
    chmod +x "$monitor_script"
    
    # Build monitor command
    local monitor_cmd="$monitor_script"
    
    if [[ "$NOTIFY" == true ]]; then
        monitor_cmd="$monitor_cmd -n"
    fi
    
    if [[ "$VERBOSE" == true ]]; then
        monitor_cmd="$monitor_cmd -v"
    fi
    
    monitor_cmd="$monitor_cmd -t $TIMEOUT"
    
    # Wait a moment for Vercel to pick up the push
    log_info "Waiting for Vercel to start deployment..."
    sleep 5
    
    # Run monitor
    echo ""
    $monitor_cmd
}

show_summary() {
    local success=$1
    
    echo ""
    echo -e "${BOLD}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    if [[ $success -eq 0 ]]; then
        echo -e "${GREEN}${BOLD}✓ DEPLOYMENT SUCCESSFUL${NC}"
        echo ""
        echo -e "${BOLD}Branch:${NC}  $BRANCH"
        echo -e "${BOLD}Status:${NC}  ${GREEN}Ready${NC}"
    else
        echo -e "${RED}${BOLD}✗ DEPLOYMENT FAILED${NC}"
        echo ""
        echo -e "${BOLD}Branch:${NC}  $BRANCH"
        echo -e "${BOLD}Status:${NC}  ${RED}Error${NC}"
        echo ""
        log_info "Check logs with: vercel logs"
    fi
    
    echo ""
    echo -e "${BOLD}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -m|--message)
            COMMIT_MESSAGE="$2"
            shift 2
            ;;
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        -n|--notify)
            NOTIFY=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -s|--skip-commit)
            SKIP_COMMIT=true
            shift
            ;;
        -t|--timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
main() {
    show_banner
    
    check_git_repo
    
    if [[ "$SKIP_COMMIT" == false ]]; then
        # Check if there are changes
        if check_git_status; then
            if [[ -z "$COMMIT_MESSAGE" ]]; then
                log_error "Commit message required when changes exist"
                echo "Use: $0 -m \"Your commit message\""
                exit 1
            fi
            
            run_pre_deployment_checks
            
            # Stage and commit
            if ! stage_and_commit "$COMMIT_MESSAGE"; then
                log_error "Failed to create commit"
                exit 1
            fi
        else
            log_info "No changes to commit"
        fi
        
        # Push to remote
        echo ""
        if ! push_to_remote "$BRANCH"; then
            log_error "Failed to push changes"
            exit 1
        fi
    else
        log_info "Skipping commit and push (monitor only mode)"
    fi
    
    # Monitor deployment
    echo ""
    log_info "Starting deployment monitoring..."
    
    if monitor_deployment; then
        show_summary 0
        exit 0
    else
        show_summary 1
        exit 1
    fi
}

# Handle Ctrl+C gracefully
trap 'echo ""; log_warning "Deployment cancelled"; exit 130' INT

# Run main function
main
