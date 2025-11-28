# FxMath Free - XAUUSD Trading Strategies

![FxMath Logo](https://img.shields.io/badge/FxMath-Trading%20Strategies-blue)
![Strategies](https://img.shields.io/badge/Strategies-468-green)
![License](https://img.shields.io/badge/License-Free-brightgreen)

A comprehensive collection of **468 automated trading strategies** for XAUUSD (Gold vs US Dollar) with advanced analytics dashboard, interactive charts, and performance metrics.

## Live Demo

Access the strategy explorer: [FxMath XAUUSD Strategies](https://fxmathsolution.github.io/FxMathFree/)

## Features

### Advanced Dashboard
- **Interactive Charts** powered by Chart.js
  - Profit Distribution Analysis
  - Win Rate vs Profit Factor Scatter Plot
  - Performance Radar Comparison
  - Drawdown Risk Analysis
- **Real-time Statistics**
  - Average and Maximum Metrics
  - Dynamic Filtering Results
  - Performance Insights

### Powerful Search & Filtering
- **Full-text Search** across strategy names, IDs, and indicators
- **Advanced Filters**:
  - Minimum Win Rate (%)
  - Minimum Total Profit ($)
  - Minimum Profit Factor
  - Maximum Drawdown (%)
  - Minimum Sharpe Ratio
- **Quick Filters**:
  - Top Performers (Profit > $2000, PF > 1.5)
  - High Win Rate (> 35%)
  - Low Drawdown (< 3%)

### Strategy Details
Each strategy includes:
- **Performance Metrics**
  - Total Profit
  - Win Rate
  - Profit Factor
  - Sharpe Ratio
  - Max Drawdown
  - Total Trades
- **Trading Rules**
  - Buy Signal Rules (all conditions must be met)
  - Sell Signal Rules (all conditions must be met)
- **Risk Management**
  - Stop Loss (ATR-based)
  - Take Profit (ATR-based)
  - TimeFrame (H1 - 1 Hour)
- **Trade Statistics**
  - Winning/Losing Trades
  - Average Win/Loss
  - Win/Loss Ratio

### Modern UI/UX
- **Dark/Light Mode** toggle with smooth transitions
- **Responsive Design** for desktop, tablet, and mobile
- **Glassmorphism Effects** and modern styling
- **Expandable Cards** for detailed strategy view
- **Download Integration** - One-click download of strategy files

## Quick Start

### Option 1: View Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/FxMathSolution/FxMathFree.git
   cd FxMathFree
   ```

2. **Start a local server**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Option 2: Direct File Access

Simply open `index.html` in your web browser (works offline!)

## Project Structure

```
FxMathFree-main/
├── index.html                  # Main dashboard (advanced version)
├── index_simple.html           # Simple version (backup)
├── strategies_index.json       # JSON index of all 468 strategies (1.4MB)
├── extract_strategies.py       # Python script to regenerate JSON
├── XAUUSD/                     # Directory with 468 strategy ZIP files
│   ├── FxMath_Free_XAUUSD_101.zip
│   ├── FxMath_Free_XAUUSD_10157.zip
│   └── ... (468 total)
└── README.md                   # This file
```

### Strategy ZIP Contents
Each ZIP file contains:
- `.ex4` - MetaTrader 4 Expert Advisor
- `.ex5` - MetaTrader 5 Expert Advisor
- `.txt` - Strategy details and backtest results

## Regenerating the JSON Index

If you modify or add strategies, regenerate the index:

```bash
python3 extract_strategies.py
```

This will:
- Scan all ZIP files in the `XAUUSD/` folder
- Extract strategy information from `.txt` files
- Generate `strategies_index.json` with complete data

## Usage Guide

### Searching for Strategies

**By Indicator:**
- Search for "RSI" to find all RSI-based strategies
- Search for "EMA", "MACD", "Bollinger", "Stochastic", etc.

**By Performance:**
- Use filters to find strategies with specific metrics
- Sort by profit, win rate, profit factor, etc.

**Quick Filters:**
- Click "Top Performers" for best overall strategies
- Click "High Win Rate" for consistent winners
- Click "Low Drawdown" for conservative strategies

### Comparing Strategies

1. Select multiple strategies using checkboxes
2. Click "Compare" button in the bottom bar
3. View side-by-side comparison (feature in development)

### Downloading Strategies

1. Click on any strategy card to expand details
2. Click "Download Files" button
3. ZIP file contains MT4/MT5 Expert Advisors and documentation

## Strategy Information

### Trading Information
- **Pair:** XAUUSD (Gold vs US Dollar)
- **TimeFrame:** H1 (1 Hour)
- **Signal Type:** Rule-based (all conditions must be met)

### Risk Management
All strategies use ATR-based dynamic risk management:
- **Stop Loss:** Varies (e.g., 1.2 × ATR(7))
- **Take Profit:** Varies (e.g., 4.5 × ATR(7))
- **ATR Period:** Typically 7 bars

### Performance Metrics Explained

| Metric | Description |
|--------|-------------|
| **Total Profit** | Cumulative profit from backtesting |
| **Win Rate** | Percentage of winning trades |
| **Profit Factor** | Gross profit / Gross loss (>1.0 is profitable) |
| **Sharpe Ratio** | Risk-adjusted return (higher is better) |
| **Max Drawdown** | Maximum peak-to-trough decline (%) |
| **Win/Loss Ratio** | Average win / Average loss |

## Technology Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Charts:** Chart.js 4.4.0
- **Design:** Custom CSS with CSS Variables for theming
- **Data:** JSON (client-side processing)
- **Backend:** None required (fully static)

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Opera

## Contact & Support

- **Website:** [https://www.fxmath.com](https://www.fxmath.com)
- **Email:** fxmathsolution@gmail.com
- **Telegram:** [@FxMath](https://t.me/FxMath)
- **Telegram Group:** [@FxMathAI](https://t.me/FxMathAI)

## Disclaimer

**Important:** These strategies are provided for educational and research purposes only.

- Past performance does not guarantee future results
- Trading involves substantial risk of loss
- Always use proper risk management
- Test strategies on demo accounts before live trading
- Consult with a financial advisor before trading

## License

Free to use for personal and educational purposes.

## Contributing

Found an issue or have a suggestion? Please open an issue on GitHub!

## Changelog

### Version 2.0 (Latest)
- Added advanced dashboard with interactive charts
- Implemented dark/light mode toggle
- Added comparison feature framework
- Enhanced search with filter tags
- Improved mobile responsiveness
- Added SVG icons for modern UI

### Version 1.0
- Initial release with 468 strategies
- Basic search and filter functionality
- Simple card-based layout

---

**Built with ❤️ by FxMath Financial Solution**

*Empowering traders with data-driven strategies*
