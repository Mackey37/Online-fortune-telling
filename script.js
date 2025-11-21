// 签文数据 (保持不变)
const fortunes = [
    // 概率最低，点击次数最多 (L5 最亮)
    {
        title: "大吉 (Great Fortune)",
        text: "万事顺心，心想事成，宜大胆尝试新事物。今日是你最好的时机！",
        weight: 1, 
        clicksRequired: 5 
    },
    {
        title: "中吉 (Good Fortune)",
        text: "今日平顺安康，小有收获，适合稳扎稳打。付出必有回报。",
        weight: 2, 
        clicksRequired: 4
    },
    {
        title: "小吉 (Minor Fortune)",
        text: "虽有小忧，但无大碍。凡事谨慎，保持乐观。",
        weight: 4, 
        clicksRequired: 3
    },
    {
        title: "末吉 (Mixed Fortune)",
        text: "略有波折，须防口舌之争。保持平常心，切勿急躁。",
        weight: 6, 
        clicksRequired: 2
    },
    // 概率最高，点击次数最少 (L1 最暗)
    {
        title: "大凶 (Bad Omen)",
        text: "今日不宜操之过急，三思而后行，静待时机。低调行事可避祸。",
        weight: 7, 
        clicksRequired: 1
    }
];

// 初始化全局状态变量 (保持不变)
let isDrawing = false; 
let resultFortune = null; 
let currentClicks = 0; 
let totalClicksNeeded = 0; 

// --- 元素引用 ---
const statusMessage = document.getElementById('status-message'); // 新增：状态信息
const resultBox = document.getElementById('result-box'); 
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const barrelArea = document.getElementById('barrel-area'); // 可点击区域
const barrelGlow = document.getElementById('barrel-glow'); 

// --- 权重随机抽取函数 (保持不变) ---
function getRandomFortuneWeighted() {
    let totalWeight = fortunes.reduce((sum, item) => sum + item.weight, 0);
    let randomNum = Math.random() * totalWeight;

    for (const fortune of fortunes) {
        if (randomNum < fortune.weight) {
            return fortune;
        }
        randomNum -= fortune.weight;
    }
    return fortunes[fortunes.length - 1]; 
}


// --- 主逻辑函数 (响应点击) ---
function handleDrawClick() {
    // 1. **首次点击：确定结果**
    if (!isDrawing) {
        // 隐藏结果框
        resultBox.style.display = 'none'; 
        
        isDrawing = true;
        resultFortune = getRandomFortuneWeighted();
        totalClicksNeeded = resultFortune.clicksRequired;
        currentClicks = 0;

        // 立即执行第一次点击的步骤
        processClickStep();
        
    } 
    // 2. **后续点击：显示进度**
    else {
        // 如果点击次数未满
        if (currentClicks < totalClicksNeeded) {
            processClickStep();
        } 
        // 如果点击次数已满
        else {
            // 点击完成后的点击，视为重新开始
            endDrawProcess();
        }
    }
}


/**
 * 处理每一次点击的动画和状态更新
 */
function processClickStep() {
    currentClicks++;

    // 1. 添加晃动动画
    barrelArea.classList.add('shaking');
    
    // 2. 控制发光亮度 (L1-L5)
    const glowLevel = currentClicks / totalClicksNeeded; 
    const minOpacity = 0.2;
    const maxOpacity = 1.0;
    const opacity = minOpacity + (maxOpacity - minOpacity) * glowLevel;
    
    barrelGlow.style.opacity = opacity.toFixed(2);
    
    // 3. 更新状态信息 (在底部显示进度)
    const remainingClicks = totalClicksNeeded - currentClicks;
    if (remainingClicks > 0) {
        statusMessage.textContent = `当前发光等级 L${currentClicks}，请再点击 ${remainingClicks} 次！`;
    }
    
    // 4. 移除晃动动画 (确保可以再次触发)
    setTimeout(() => {
        barrelArea.classList.remove('shaking');
        
        // 5. 如果点击次数已满，显示最终结果
        if (currentClicks >= totalClicksNeeded) {
            displayFinalResult();
        }
    }, 300); // 300ms 对应 CSS 动画时间
}


/**
 * 显示最终结果
 */
function displayFinalResult() {
    // 切换到结束状态，但保持发光
    isDrawing = false;
    
    // 显示结果框
    resultBox.style.display = 'block'; 
    
    resultTitle.textContent = resultFortune.title;
    resultText.textContent = resultFortune.text;
    
    // 状态信息提示可以重新开始
    statusMessage.textContent = `运势已出：${resultFortune.title}！点击求签桶重新开始。`;
}

/**
 * 结束并重置状态，准备下一次求签
 */
function endDrawProcess() {
    isDrawing = false;
    resultFortune = null;
    currentClicks = 0;
    totalClicksNeeded = 0;
    
    // 重置发光
    barrelGlow.style.opacity = 0;
    
    // 隐藏结果框
    resultBox.style.display = 'none'; 
    
    // 重置状态信息
    statusMessage.textContent = "点击求签桶开始求签";
}

// --- 事件监听：让求签桶工作 ---
// 将点击事件绑定到求签桶区域
barrelArea.addEventListener('click', handleDrawClick);

// --- 初始设置 ---
window.onload = endDrawProcess; // 确保页面加载时是重置状态