var ghpages = require('gh-pages');

ghpages.publish(
    '../public',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/sconway/covid-tracker.git',
        user: {
            name: 'scott',
            email: 'scoot1243@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)