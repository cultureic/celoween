#!/bin/bash

# =============================================================================
# Vercel Deployment Monitor Script
# =============================================================================
# This script monitors Vercel deployments and provides real-time status updates
# 
# Usage:
#   ./scripts/monitor-deployment.sh [options]
#
# Options:
#   -h, --help          Show this help message
#   -w, --watch         Continuous monitoring mode
#   -t, --timeout <sec> Set timeout in seconds (default: 600)
#   -n, --notify        Enable desktop notifications (macOS)
#   -v, --verbose       Verbose output
#   -u, --url <url>     Monitor specific deployment URL
#
# Examples:
#   ./scripts/monitor-deployment.sh                    # Monitor latest deployment
#   ./scripts/monitor-deployment.sh -w                 # Watch mode
#   ./scripts/monitor-deployment.sh -t 300 -n          # 5 min timeout with notifications
# =============================================================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
TIMEOUT=600  # 10 minutes default
POLL_INTERVAL=5  # seconds
WATCH_MODE=false
NOTIFY=false
VERBOSE=false
DEPLOYMENT_URL=""

# Functions
show_help() {
    cat << EOF
${BOLD}Vercel Deployment Monitor${NC}

Monitor Vercel deployments with real-time status updates.

${BOLD}USAGE:${NC}
    $0 [OPTIONS]

${BOLD}OPTIONS:${NC}
    -h, --help              Show this help message
    -w, --watch             Continuous monitoring mode
    -t, --timeout SECONDS   Set timeout in seconds (default: 600)
    -n, --notify            Enable desktop notifications (macOS)
    -v, --verbose           Verbose output
    -u, --url URL           Monitor specific deployment URL

${BOLD}EXAMPLES:${NC}
    $0                              # Monitor latest deployment
    $0 -w                           # Watch mode
    $0 -t 300 -n                    # 5 min timeout with notifications
    $0 -u https://celo-xyz.vercel.app  # Monitor specific deployment

${BOLD}ENVIRONMENT:${NC}
    VERCEL_TOKEN    Optional: Vercel authentication token

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

notify_desktop() {
    if [[ "$NOTIFY" == true ]] && [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "display notification \"$2\" with title \"Vercel Deployment\" subtitle \"$1\""
    fi
}

check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI not found. Please install it:"
        echo "  npm install -g vercel"
        exit 1
    fi
}

get_latest_deployment() {
    local deployments=$(vercel ls --yes 2>/dev/null | grep -E "https://" | head -1 || echo "")
    if [[ -z "$deployments" ]]; then
        log_error "No deployments found"
        exit 1
    fi
    echo "$deployments" | awk '{print $2}'
}

get_deployment_status() {
    local url=$1
    local status=$(vercel ls --yes 2>/dev/null | grep "$url" | awk '{print $3,$4}' || echo "UNKNOWN")
    echo "$status"
}

get_deployment_details() {
    local url=$1
    vercel inspect "$url" 2>/dev/null || echo "Unable to fetch details"
}

parse_status() {
    local status=$1
    case "$status" in
        *"Ready"*)
            echo "READY"
            ;;
        *"Building"*)
            echo "BUILDING"
            ;;
        *"Error"*)
            echo "ERROR"
            ;;
        *"Queued"*)
            echo "QUEUED"
            ;;
        *"Canceled"*)
            echo "CANCELED"
            ;;
        *)
            echo "UNKNOWN"
            ;;
    esac
}

get_status_icon() {
    local status=$1
    case "$status" in
        "READY")
            echo "✓"
            ;;
        "BUILDING")
            echo "⏳"
            ;;
        "ERROR")
            echo "✗"
            ;;
        "QUEUED")
            echo "⏸"
            ;;
        "CANCELED")
            echo "⊘"
            ;;
        *)
            echo "?"
            ;;
    esac
}

get_status_color() {
    local status=$1
    case "$status" in
        "READY")
            echo "$GREEN"
            ;;
        "BUILDING")
            echo "$YELLOW"
            ;;
        "ERROR")
            echo "$RED"
            ;;
        "QUEUED")
            echo "$BLUE"
            ;;
        "CANCELED")
            echo "$MAGENTA"
            ;;
        *)
            echo "$NC"
            ;;
    esac
}

show_deployment_info() {
    local url=$1
    local project_name=$(basename $(pwd))
    
    echo ""
    echo -e "${BOLD}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}║           VERCEL DEPLOYMENT MONITOR                            ║${NC}"
    echo -e "${BOLD}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BOLD}Project:${NC}     $project_name"
    echo -e "${BOLD}URL:${NC}         $url"
    echo -e "${BOLD}Timeout:${NC}     ${TIMEOUT}s"
    echo -e "${BOLD}Started:${NC}     $(date)"
    echo ""
}

show_progress_bar() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local filled=$((width * current / total))
    local empty=$((width - filled))
    
    printf "\r["
    printf "%${filled}s" | tr ' ' '█'
    printf "%${empty}s" | tr ' ' '░'
    printf "] %3d%%" "$percentage"
}

monitor_deployment() {
    local url=$1
    local elapsed=0
    local last_status=""
    
    show_deployment_info "$url"
    
    while [[ $elapsed -lt $TIMEOUT ]]; do
        local status_raw=$(get_deployment_status "$url")
        local status=$(parse_status "$status_raw")
        local icon=$(get_status_icon "$status")
        local color=$(get_status_color "$status")
        
        # Show status update if changed
        if [[ "$status" != "$last_status" ]]; then
            if [[ -n "$last_status" ]]; then
                echo "" # New line after progress bar
            fi
            echo -e "${color}${BOLD}${icon} Status: ${status}${NC}"
            
            if [[ "$VERBOSE" == true ]]; then
                log_info "Raw status: $status_raw"
            fi
            
            last_status="$status"
        fi
        
        # Show progress bar
        show_progress_bar $elapsed $TIMEOUT
        
        # Check terminal states
        case "$status" in
            "READY")
                echo "" # New line after progress bar
                log_success "Deployment completed successfully!"
                echo ""
                echo -e "${BOLD}Deployment URL:${NC} ${GREEN}$url${NC}"
                
                if [[ "$VERBOSE" == true ]]; then
                    echo ""
                    echo -e "${BOLD}Deployment Details:${NC}"
                    get_deployment_details "$url"
                fi
                
                notify_desktop "Success" "Deployment completed successfully"
                echo ""
                return 0
                ;;
            "ERROR")
                echo "" # New line after progress bar
                log_error "Deployment failed!"
                echo ""
                echo -e "${BOLD}Deployment URL:${NC} ${RED}$url${NC}"
                echo ""
                log_info "View logs with: vercel logs $url"
                
                notify_desktop "Failed" "Deployment encountered an error"
                return 1
                ;;
            "CANCELED")
                echo "" # New line after progress bar
                log_warning "Deployment was canceled"
                notify_desktop "Canceled" "Deployment was canceled"
                return 2
                ;;
        esac
        
        sleep $POLL_INTERVAL
        elapsed=$((elapsed + POLL_INTERVAL))
    done
    
    echo "" # New line after progress bar
    log_warning "Timeout reached after ${TIMEOUT}s"
    notify_desktop "Timeout" "Deployment monitoring timed out"
    return 3
}

watch_deployments() {
    log_info "Starting watch mode (Press Ctrl+C to exit)"
    echo ""
    
    local last_deployment=""
    
    while true; do
        local current_deployment=$(get_latest_deployment)
        
        if [[ "$current_deployment" != "$last_deployment" ]]; then
            if [[ -n "$last_deployment" ]]; then
                echo ""
                echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
                echo ""
            fi
            
            log_info "New deployment detected: $current_deployment"
            monitor_deployment "$current_deployment"
            last_deployment="$current_deployment"
        else
            printf "\r${BLUE}[$(date +'%H:%M:%S')]${NC} Watching for new deployments..."
            sleep 5
        fi
    done
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -w|--watch)
            WATCH_MODE=true
            shift
            ;;
        -t|--timeout)
            TIMEOUT="$2"
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
        -u|--url)
            DEPLOYMENT_URL="$2"
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
    check_vercel_cli
    
    if [[ "$WATCH_MODE" == true ]]; then
        watch_deployments
    else
        if [[ -z "$DEPLOYMENT_URL" ]]; then
            log_info "Fetching latest deployment..."
            DEPLOYMENT_URL=$(get_latest_deployment)
        fi
        
        monitor_deployment "$DEPLOYMENT_URL"
    fi
}

# Handle Ctrl+C gracefully
trap 'echo ""; log_warning "Monitoring stopped"; exit 0' INT

# Run main function
main
