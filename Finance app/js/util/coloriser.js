import $ from 'jquery';

export class Coloriser {

    static table(elementsToColorBy) {
        //Colorise table according to Prediction score
        elementsToColorBy.each((i, value) => {
            const predictionScore = $(value);
            let contentRaw = predictionScore.html().trim();
            let points = +contentRaw.substring(0, contentRaw.length - 1);

            if (points > 50) {
                predictionScore.parent().addClass('list-group-item-success');
            } else {
                predictionScore.parent().addClass('list-group-item-danger');
            }
        })
    }
    static backgroundPrimary(elementsToColorBy) {
        elementsToColorBy.addClass('bg-primary');
    }
}