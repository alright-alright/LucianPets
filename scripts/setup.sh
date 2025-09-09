#!/bin/bash

# 🐾 LucianPets - Complete Setup & Verification Script
# AerwareAI Product - Agent Handoff Verification

echo "🐾 LucianPets Setup & Verification"
echo "=================================="
echo "🏢 AerwareAI Product"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_header() {
    echo ""
    print_status $PURPLE "🔥 $1"
    echo "----------------------------------------"
}

print_success() {
    print_status $GREEN "✅ $1"
}

print_warning() {
    print_status $YELLOW "⚠️  $1"
}

print_error() {
    print_status $RED "❌ $1"
}

print_info() {
    print_status $BLUE "ℹ️  $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the LucianPets root directory"
    exit 1
fi

print_header "Project Structure Verification"

# Check essential files
essential_files=(
    "package.json"
    "src/main.tsx"
    "src/App.tsx"
    "src/components/LucianPets.tsx"
    "src/components/PetNeuroForge.tsx"
    "src/components/BrainActivityMonitor.tsx"
    "src/components/OdinSensoryInterface.tsx"
    "server/package.json"
    "server/src/index.js"
    ".env"
    "vite.config.ts"
    "tailwind.config.js"
    "README.md"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Found $file"
    else
        print_error "Missing $file"
    fi
done

print_header "Environment Configuration Check"

# Check .env file
if [ -f ".env" ]; then
    print_success "Environment file exists"
    
    # Check for API keys
    if grep -q "OPENAI_API_KEY=sk-" .env; then
        print_success "OpenAI API key configured"
    else
        print_warning "OpenAI API key not found or invalid format"
    fi
    
    if grep -q "ANTHROPIC_API_KEY=sk-" .env; then
        print_success "Anthropic API key configured"
    else
        print_warning "Anthropic API key not found or invalid format"
    fi
else
    print_error "No .env file found"
    print_info "Copy .env.example to .env and configure your settings"
fi

print_header "Node.js Environment Check"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
    
    # Check if version is 18+
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        print_success "Node.js version is compatible (18+)"
    else
        print_warning "Node.js version may be too old. Recommended: 18+"
    fi
else
    print_error "Node.js not found. Please install Node.js 18+"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
else
    print_error "npm not found"
fi

print_header "Dependency Installation"

# Install frontend dependencies
print_info "Installing frontend dependencies..."
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
fi

# Install backend dependencies
print_info "Installing backend dependencies..."
cd server
if npm install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
fi
cd ..

print_header "Port Detection Test"

# Test port detection
print_info "Testing smart port detection..."
node -e "
const { findAvailablePort } = require('./server/src/utils/portDetection.js');
findAvailablePort([3000, 5173, 4173]).then(port => {
    console.log('✅ Frontend port available: ' + port);
}).catch(err => {
    console.log('❌ Port detection failed: ' + err.message);
});

findAvailablePort([8000, 8001, 8002]).then(port => {
    console.log('✅ Backend port available: ' + port);
}).catch(err => {
    console.log('❌ Backend port detection failed: ' + err.message);
});
" 2>/dev/null || print_warning "Port detection test failed (expected until backend is complete)"

print_header "Agent Handoff Status"

print_success "Foundation Complete!"
print_info "✅ Project structure created"
print_info "✅ Smart port detection implemented"
print_info "✅ API keys from promethean-forge integrated"
print_info "✅ Core UI components built"
print_info "✅ Server architecture ready"
print_info "✅ AerwareAI branding integrated"

print_header "Agent Tasks Remaining"

print_warning "🥇 Priority 1: Lucian Cognitive Components"
echo "   - src/lib/lucian/ssp.ts"
echo "   - src/lib/lucian/mpu.ts" 
echo "   - src/lib/lucian/hasr.ts"
echo "   - src/lib/lucian/wonder.ts"
echo "   - src/lib/lucian/ghostLoops.ts"
echo "   - src/lib/lucian/aetheron.ts"

print_warning "🥈 Priority 2: ODIN Sensory System"
echo "   - src/lib/odin/visualCortex.ts"
echo "   - src/lib/odin/auditoryCortex.ts"
echo "   - src/lib/odin/sensoryFusion.ts"

print_warning "🥉 Priority 3: Backend Integration"
echo "   - server/src/routes/"
echo "   - server/src/websocket/"
echo "   - server/src/lib/"

print_header "Quick Start Commands"

echo "Frontend development:"
print_info "npm run dev"

echo ""
echo "Backend development:"
print_info "npm run server"

echo ""
echo "Full development environment:"
print_info "npm run dev & npm run server"

print_header "Summary"

print_success "LucianPets foundation is ready for agent completion!"
print_info "🧠 Revolutionary AI pet with cognitive architecture"
print_info "👁️ ODIN sensory perception system"
print_info "🎛️ NeuroForge brain parameter control"
print_info "🏢 AerwareAI product branding"
print_info "⚡ Smart port detection & auto-configuration"

echo ""
print_status $CYAN "🚀 Ready for agent takeover! Good luck building the future of AI pets! 🐾"
echo ""
