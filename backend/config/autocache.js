const redis = require('../controllers/redis');
const logger = require('../config/logger');
const svtapi = require('../controllers/svtplay');

async function getAllPrograms() {
    const p1 = svtapi
        .getURLProxy(svtapi.programUrlSimple, 'simple')
        .then((r) => svtapi.createSimpleJson(r));
    const p2 = svtapi.getURL(svtapi.programUrl, 'programUrl');
    return Promise.all([p1, p2]);
}

function genCharObj(charA, charZ) {
    // const a = [];
    const obj = {};
    obj['Övrigt'] = [];
    let i = charA.charCodeAt(0);
    const j = charZ.charCodeAt(0);
    for (; i <= j; i++) {
        const letter = String.fromCharCode(i);
        obj[letter] = [];
    }
    obj['Å'] = [];
    obj['Ä'] = [];
    obj['Ö'] = [];
    return obj;
}

const parser = async () => {
    console.time('parser');
    const obj = genCharObj('A', 'Z');
    const data = await getAllPrograms();
    const simple = data[0].program;
    const advanced = data[1].data.programAtillO.flat;
    // prettier-ignore
    const symbol = /^[A-Z]*$/;
    const sorted = simple.sort();
    for (let i = 0; i < 1605; i++) {
        //  logger.info(sorted.length);
        // prettier-ignore
        if (sorted[i][0][0].match(symbol)) obj[sorted[i][0][0]].push({ title: sorted[i][0] });
        else obj['Övrigt'].push({ title: sorted[i][0] }); // logger.info(sorted[i][0]);
    }
    // logger.info(obj);
    console.timeEnd('parser');
};
/*
obj.regex[letter].push({ title: sorted[i][0] })
    for (let i = 0; i < simple.length; i++) {
        const j = 0;
        logger.info(i);
        // logger.info(simple[i][0][0]);
        logger.info(regex[0]);
        // obj.regex[i].push({ hej: 'då' });
    }

    logger.info(obj);
};

/*while (j < 1 && letter < 29) {
            if (simple[i][0][0] == regex[i]) obj.regex[i].push({ title: simple[i] });
            else j = 1;
        }
        letter++;
    } */

const tester = async () => {
    parser().catch((e) => logger.info(e));
};

function autoCache() {
    setTimeout(async () => {
        const atillo = await getAllPrograms();
        logger.info(atillo[0][0]);
        redis.flush();
        redis.jsonSet(
            JSON.stringify([
                {
                    name: atillo[0][0],
                    x: atillo[0][1],
                    y: atillo[0][2],
                    z: atillo[0][3],
                },
            ]),
        );
    });
}

exports.autoCache = autoCache;
exports.tester = tester;
