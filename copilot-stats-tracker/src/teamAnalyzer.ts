import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface DailyStatEntry {
    date: string;
    userName: string;
    totalLinesAdded: number;
    totalLinesDeleted: number;
    totalLinesModified: number;
    acceptanceCount: number;
}

interface UserStats {
    totalAdded: number;
    totalDeleted: number;
    totalModified: number;
    totalAcceptances: number;
    dayCount: number;
}

interface DailyAggregateStats {
    linesAdded: number;
    linesDeleted: number;
    linesModified: number;
    activeUsers: Set<string>;
}

export class TeamAnalyzer {
    
    /**
     * Tüm copilot-daily-stats.json dosyalarını bulur
     */
    private static findStatsFiles(rootDir: string): string[] {
        const results: string[] = [];
        
        const searchDir = (dir: string) => {
            try {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    
                    // node_modules ve gizli klasörleri atla
                    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                        continue;
                    }
                    
                    if (entry.isDirectory()) {
                        searchDir(fullPath);
                    } else if (entry.name === 'copilot-daily-stats.json') {
                        results.push(fullPath);
                    }
                }
            } catch (error) {
                // Erişim hatalarını sessizce atla
            }
        };
        
        searchDir(rootDir);
        return results;
    }

    /**
     * Ekip istatistiklerini analiz eder
     */
    public static analyzeTeamStats(searchPath?: string): {
        userStats: Map<string, UserStats>;
        dailyStats: Map<string, DailyAggregateStats>;
        files: string[];
    } | null {
        const basePath = searchPath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        
        if (!basePath) {
            vscode.window.showWarningMessage('Workspace klasörü bulunamadı.');
            return null;
        }

        // JSON dosyalarını bul
        const files = this.findStatsFiles(basePath);

        if (files.length === 0) {
            vscode.window.showWarningMessage(
                `'${basePath}' dizininde copilot-daily-stats.json dosyası bulunamadı.`
            );
            return null;
        }

        const userStats = new Map<string, UserStats>();
        const dailyStats = new Map<string, DailyAggregateStats>();

        // Tüm dosyaları oku ve analiz et
        files.forEach(filePath => {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const data: DailyStatEntry[] = JSON.parse(content);

                data.forEach(entry => {
                    const user = entry.userName;
                    const date = entry.date;

                    // Kullanıcı istatistiklerini güncelle
                    if (!userStats.has(user)) {
                        userStats.set(user, {
                            totalAdded: 0,
                            totalDeleted: 0,
                            totalModified: 0,
                            totalAcceptances: 0,
                            dayCount: 0
                        });
                    }

                    const stats = userStats.get(user)!;
                    stats.totalAdded += entry.totalLinesAdded;
                    stats.totalDeleted += entry.totalLinesDeleted;
                    stats.totalModified += entry.totalLinesModified;
                    stats.totalAcceptances += entry.acceptanceCount;
                    stats.dayCount += 1;

                    // Günlük istatistikleri güncelle
                    if (!dailyStats.has(date)) {
                        dailyStats.set(date, {
                            linesAdded: 0,
                            linesDeleted: 0,
                            linesModified: 0,
                            activeUsers: new Set()
                        });
                    }

                    const dayStats = dailyStats.get(date)!;
                    dayStats.linesAdded += entry.totalLinesAdded;
                    dayStats.linesDeleted += entry.totalLinesDeleted;
                    dayStats.linesModified += entry.totalLinesModified;
                    dayStats.activeUsers.add(user);
                });

            } catch (error) {
                console.error(`Dosya okuma hatası: ${filePath}`, error);
            }
        });

        return { userStats, dailyStats, files };
    }

    /**
     * HTML rapor oluşturur
     */
    public static generateHtmlReport(
        userStats: Map<string, UserStats>,
        dailyStats: Map<string, DailyAggregateStats>,
        fileCount: number
    ): string {
        // Genel özet hesapla
        let totalAdded = 0;
        let totalDeleted = 0;
        let totalModified = 0;
        let totalAcceptances = 0;

        userStats.forEach(stats => {
            totalAdded += stats.totalAdded;
            totalDeleted += stats.totalDeleted;
            totalModified += stats.totalModified;
            totalAcceptances += stats.totalAcceptances;
        });

        const totalUsers = userStats.size;
        const totalDays = dailyStats.size;
        const netChange = totalAdded - totalDeleted;

        // Kullanıcıları eklenen satıra göre sırala
        const sortedUsers = Array.from(userStats.entries())
            .sort((a, b) => b[1].totalAdded - a[1].totalAdded);

        // Günleri sırala (son 14 gün)
        const sortedDays = Array.from(dailyStats.keys())
            .sort()
            .reverse()
            .slice(0, 14)
            .reverse();

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            line-height: 1.6;
        }
        .header {
            border-bottom: 3px solid var(--vscode-focusBorder);
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            margin: 0;
            color: var(--vscode-textLink-foreground);
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: var(--vscode-editor-inactiveSelectionBackground);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid var(--vscode-focusBorder);
        }
        .summary-card h3 {
            margin: 0 0 5px 0;
            font-size: 14px;
            opacity: 0.8;
        }
        .summary-card .value {
            font-size: 24px;
            font-weight: bold;
        }
        .section {
            margin: 30px 0;
        }
        .section h2 {
            border-bottom: 2px solid var(--vscode-panel-border);
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        th {
            background: var(--vscode-editor-inactiveSelectionBackground);
            font-weight: 600;
        }
        tr:hover {
            background: var(--vscode-list-hoverBackground);
        }
        .positive { color: #4ec9b0; }
        .negative { color: #f48771; }
        .neutral { color: #dcdcaa; }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-success { background: #4ec9b022; color: #4ec9b0; }
        .badge-danger { background: #f4877122; color: #f48771; }
        .badge-warning { background: #dcdcaa22; color: #dcdcaa; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid var(--vscode-panel-border);
            opacity: 0.6;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Copilot Ekip İstatistikleri</h1>
        <p>Tarih: ${new Date().toLocaleDateString('tr-TR')} | Analiz edilen dosya: ${fileCount}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>👥 Toplam Kullanıcı</h3>
            <div class="value">${totalUsers}</div>
        </div>
        <div class="summary-card">
            <h3>📅 Aktif Gün</h3>
            <div class="value">${totalDays}</div>
        </div>
        <div class="summary-card">
            <h3>✅ Eklenen Satır</h3>
            <div class="value positive">${totalAdded.toLocaleString()}</div>
        </div>
        <div class="summary-card">
            <h3>❌ Silinen Satır</h3>
            <div class="value negative">${totalDeleted.toLocaleString()}</div>
        </div>
        <div class="summary-card">
            <h3>🔄 Değiştirilen</h3>
            <div class="value neutral">${totalModified.toLocaleString()}</div>
        </div>
        <div class="summary-card">
            <h3>💰 Net Değişim</h3>
            <div class="value ${netChange >= 0 ? 'positive' : 'negative'}">
                ${netChange >= 0 ? '+' : ''}${netChange.toLocaleString()}
            </div>
        </div>
    </div>

    <div class="section">
        <h2>👥 Kullanıcı Bazlı İstatistikler</h2>
        <table>
            <thead>
                <tr>
                    <th>Kullanıcı</th>
                    <th>Eklenen</th>
                    <th>Silinen</th>
                    <th>Değiştirilen</th>
                    <th>Net</th>
                    <th>İşlem</th>
                    <th>Aktif Gün</th>
                    <th>Günlük Ort.</th>
                </tr>
            </thead>
            <tbody>
                ${sortedUsers.map(([user, stats]) => {
                    const net = stats.totalAdded - stats.totalDeleted;
                    const avgPerDay = stats.dayCount > 0 ? stats.totalAdded / stats.dayCount : 0;
                    return `
                        <tr>
                            <td><strong>${user}</strong></td>
                            <td><span class="badge badge-success">${stats.totalAdded.toLocaleString()}</span></td>
                            <td><span class="badge badge-danger">${stats.totalDeleted.toLocaleString()}</span></td>
                            <td><span class="badge badge-warning">${stats.totalModified.toLocaleString()}</span></td>
                            <td class="${net >= 0 ? 'positive' : 'negative'}">${net >= 0 ? '+' : ''}${net.toLocaleString()}</td>
                            <td>${stats.totalAcceptances.toLocaleString()}</td>
                            <td>${stats.dayCount}</td>
                            <td>${avgPerDay.toFixed(1)}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>📅 Günlük İstatistikler (Son 14 Gün)</h2>
        <table>
            <thead>
                <tr>
                    <th>Tarih</th>
                    <th>Eklenen</th>
                    <th>Silinen</th>
                    <th>Aktif Kullanıcı</th>
                </tr>
            </thead>
            <tbody>
                ${sortedDays.map(date => {
                    const stats = dailyStats.get(date)!;
                    return `
                        <tr>
                            <td><strong>${date}</strong></td>
                            <td class="positive">${stats.linesAdded.toLocaleString()}</td>
                            <td class="negative">${stats.linesDeleted.toLocaleString()}</td>
                            <td>${stats.activeUsers.size} kişi</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Copilot Stats Tracker - Tüm istatistikler otomatik olarak toplanır ve güncellenir.</p>
    </div>
</body>
</html>
        `;
    }

    /**
     * WebView ile rapor gösterir
     */
    public static showTeamReport(context: vscode.ExtensionContext, searchPath?: string) {
        const analysisResult = this.analyzeTeamStats(searchPath);
        
        if (!analysisResult) {
            return;
        }

        const { userStats, dailyStats, files } = analysisResult;

        // WebView panel oluştur
        const panel = vscode.window.createWebviewPanel(
            'copilotTeamReport',
            '📊 Copilot Ekip Raporu',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        // HTML içeriği
        panel.webview.html = this.generateHtmlReport(userStats, dailyStats, files.length);
    }

    /**
     * JSON rapor kaydeder
     */
    public static async exportTeamReport(searchPath?: string) {
        const analysisResult = this.analyzeTeamStats(searchPath);
        
        if (!analysisResult) {
            return;
        }

        const { userStats, dailyStats } = analysisResult;

        // JSON raporu oluştur
        const report = {
            generatedAt: new Date().toISOString(),
            userStats: Object.fromEntries(userStats),
            dailyStats: Object.fromEntries(
                Array.from(dailyStats.entries()).map(([date, stats]) => [
                    date,
                    {
                        linesAdded: stats.linesAdded,
                        linesDeleted: stats.linesDeleted,
                        linesModified: stats.linesModified,
                        activeUsers: Array.from(stats.activeUsers)
                    }
                ])
            )
        };

        // Kayıt konumu sor
        const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file('copilot-team-report.json'),
            filters: {
                'JSON': ['json']
            }
        });

        if (uri) {
            fs.writeFileSync(uri.fsPath, JSON.stringify(report, null, 2), 'utf8');
            vscode.window.showInformationMessage(`Rapor kaydedildi: ${uri.fsPath}`);
            
            // Dosyayı aç
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc);
        }
    }
}
