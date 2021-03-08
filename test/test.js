
async function getToxicity(...sentence) {
    // eslint-disable-next-line no-undef
    toxicity.load(.8).then(model => {
        model.classify(sentence).then(predictions => {
            let map = predictions.map(prediction => {
                if (prediction.results[0].match) return prediction.label;
                else return ''
            }).filter(prediction => prediction)
            console.log(map.join(', '))
            return map.join(', ')
        });
    });
}

getToxicity('fuck you and your mom').then(d => console.log('fuck you and your mom', d))
