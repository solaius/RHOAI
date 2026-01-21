# OpenShift AI UXD Prototype

This repository contains a **design prototype** of OpenShift AI, created primarily by the User Experience Design (UXD) team. It is intended for **sharing, discussion, and design exploration purposes only**.

> **Important:** This is not production-ready code. It is a vibe-designed artifact built to support design work, facilitate stakeholder conversations, and explore UI/UX concepts for OpenShift AI.

## 3.4 Prototype Link

> [!TIP]
> Updates to this prototype will be located at this URL a few minutes after merging:
> https://rhoai-3-4-cb1313.pages.redhat.com

## Purpose

- **Design exploration**: Rapidly prototype and iterate on UI concepts
- **Stakeholder communication**: Share interactive designs with product, engineering, and other stakeholders
- **User research**: Conduct usability testing and gather feedback on proposed designs
- **Discussion artifact**: Provide a tangible reference point for design discussions

## Quick Start

**New to this project?** Check out the [Cursor Setup Guide](https://docs.google.com/document/d/1bz_lJ_OYchfKAuS0I7xcvgvSVzPm16CjQyb_7JB0_F8/edit?tab=t.rutfmkrs4883) first for the recommended development environment setup.

```bash
# Clone the repository
git clone <repository-url>
cd rhoai

# Install dependencies and start the development server
npm install && npm run start:dev
```

The prototype will be available at `http://localhost:9000`.

## Prototype Appearance Configuration

The prototype supports configurable appearance settings to prepare it for different contexts (e.g., user research, demos). Adjust the `.env` file in the root directory with the following options:

```sh
# Use generic "AI Platform" text instead of branded logo
GENERIC_LOGO=true

# Hide the orange "UXD PROTOTYPE" banner
PROTOTYPE_BAR=false

# Set default fidelity mode
DEFAULT_FIDELITY=low
```

### Available Options

**GENERIC_LOGO**
- `true`: Shows "AI Platform" as text (generic, unbranded)
- `false` (default): Shows the branded product logo

**PROTOTYPE_BAR**
- `true` (default): Shows the orange "UXD PROTOTYPE" banner with fidelity controls
- `false`: Hides the banner completely

**DEFAULT_FIDELITY**
- `high` (default): Starts with high fidelity mode
- `low`: Starts with low fidelity mode
- Note: URL query parameter `?fidelity=low` or `?fidelity=high` will override this setting

### Common Configuration Scenarios

- **User research**: Set `GENERIC_LOGO=true`, `PROTOTYPE_BAR=false`, and optionally `DEFAULT_FIDELITY=low`
- **Internal demos**: Keep defaults or customize as needed
- **Stakeholder reviews**: Use defaults with the prototype banner visible

## Technology Stack

This prototype is built with:
- [PatternFly](https://www.patternfly.org/) - Red Hat's open source design system
- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Webpack](https://webpack.js.org/) - Build tooling

## Design Documentation

Design specifications and related documentation can be found in the `.design/` directory.

## Contributing

When contributing to this prototype:
- Focus on design fidelity and user experience over code quality
- Use PatternFly components and patterns where possible
- Document any new features or design concepts in the `.design/` directory
