import * as vscode from 'vscode';
import { CopilotTracker } from './copilotTracker';
import { TeamAnalyzer } from './teamAnalyzer';

let tracker: CopilotTracker | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Copilot Stats Tracker aktif!');

    // Tracker'ı başlat
    tracker = new CopilotTracker(context);

    // İstatistikleri göster komutu
    const showStatsCommand = vscode.commands.registerCommand(
        'copilot-stats-tracker.showStats',
        () => {
            tracker?.showStats();
        }
    );

    // İstatistikleri sıfırla komutu
    const resetStatsCommand = vscode.commands.registerCommand(
        'copilot-stats-tracker.resetStats',
        () => {
            tracker?.resetStats();
        }
    );

    // Log dosyasını aç komutu
    const openLogCommand = vscode.commands.registerCommand(
        'copilot-stats-tracker.openLogFile',
        () => {
            tracker?.openLogFile();
        }
    );

    // Ekip raporunu göster komutu
    const showTeamReportCommand = vscode.commands.registerCommand(
        'copilot-stats-tracker.showTeamReport',
        () => {
            TeamAnalyzer.showTeamReport(context);
        }
    );

    // Ekip raporunu dışa aktar komutu
    const exportTeamReportCommand = vscode.commands.registerCommand(
        'copilot-stats-tracker.exportTeamReport',
        () => {
            TeamAnalyzer.exportTeamReport();
        }
    );

    // Özel dizinde ekip raporu göster
    const showTeamReportCustomCommand = vscode.commands.registerCommand(
        'copilot-stats-tracker.showTeamReportCustom',
        async () => {
            const uri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                title: 'Analiz edilecek klasörü seçin'
            });

            if (uri && uri[0]) {
                TeamAnalyzer.showTeamReport(context, uri[0].fsPath);
            }
        }
    );

    context.subscriptions.push(showStatsCommand);
    context.subscriptions.push(resetStatsCommand);
    context.subscriptions.push(openLogCommand);
    context.subscriptions.push(showTeamReportCommand);
    context.subscriptions.push(exportTeamReportCommand);
    context.subscriptions.push(showTeamReportCustomCommand);

    // Başlangıçta kullanıcı adını sor
    checkUserName();

    // Hoş geldin mesajı
    vscode.window.showInformationMessage(
        '✅ Copilot Stats Tracker başlatıldı. İstatistikleriniz kaydediliyor!'
    );
}

async function checkUserName() {
    const config = vscode.workspace.getConfiguration('copilotStatsTracker');
    const userName = config.get<string>('userName');

    if (!userName) {
        const input = await vscode.window.showInputBox({
            prompt: 'Loglarda görünmesini istediğiniz kullanıcı adınızı girin',
            placeHolder: 'Örn: AhmetY, ayse.k, vb.',
            ignoreFocusOut: true
        });

        if (input) {
            await config.update('userName', input, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Kullanıcı adı "${input}" olarak ayarlandı.`);
        }
    }
}

export function deactivate() {
    if (tracker) {
        tracker.dispose();
        tracker = undefined;
    }
}
