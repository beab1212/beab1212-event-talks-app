const fs = require('fs').promises;

async function build() {
    try {
        // Read all necessary files
        const talksData = await fs.readFile('talks.json', 'utf8');
        const template = await fs.readFile('template.html', 'utf8');
        const styles = await fs.readFile('styles.css', 'utf8');
        const script = await fs.readFile('script.js', 'utf8');

        const talks = JSON.parse(talksData);

        let scheduleHtml = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0);

        const formatTime = (date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        talks.forEach((talk, index) => {
            if (index === 3) { // After 3rd talk, add lunch break
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
                scheduleHtml += `
                   <div class="break">
                       <div class="talk-time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
                       <div>Lunch Break</div>
                   </div>
                `;
                currentTime = new Date(lunchEndTime.getTime() + 10 * 60000);
           }

            const startTime = new Date(currentTime);
            const endTime = new Date(startTime.getTime() + talk.duration * 60000);

            scheduleHtml += `
                <div class="talk">
                    <div class="talk-time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
                    <h2 class="talk-title">${talk.title}</h2>
                    <div class="talk-speakers">${talk.speakers.join(', ')}</div>
                    <div class="talk-categories">
                        ${talk.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
                    </div>
                    <p class="talk-description">${talk.description}</p>
                </div>
            `;
            
            currentTime = new Date(endTime.getTime() + 10 * 60000); // 10-minute break
        });

        // Replace placeholders in the template
        let finalHtml = template.replace('/* CSS will be injected here */', styles);
        finalHtml = finalHtml.replace('// JavaScript will be injected here', script);
        finalHtml = finalHtml.replace('<!-- Schedule will be injected here -->', scheduleHtml);

        // Write the final index.html file
        await fs.writeFile('index.html', finalHtml, 'utf8');
        console.log('Successfully generated index.html');

    } catch (error) {
        console.error('Error building the website:', error);
    }
}

build();
