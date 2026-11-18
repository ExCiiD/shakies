/* ============================================================
   Chef's Kiss : l'univers des plats, snacks, desserts et sauces.
   Même concept que Shakies : recette au hasard à l'accueil, suggestions
   dans la barre latérale, recettes, favoris et courses partagés.
   Les données viennent de chefskiss-data.js (window.CK).
   ============================================================ */

const CK_TYPES = { // types d'origine (servent seulement à choisir l'illustration)
  Meal:{icon:"🍲"}, Snack:{icon:"🥟"}, Dessert:{icon:"🍰"}, Breakfast:{icon:"🥞"}, Side:{icon:"🥗"}, Sauce:{icon:"🫙"},
};

/* ---------- Classement : groupes et sous-types ---------- */
// Chaque groupe : [libellé, icône, singulier, sous-types [clé, libellé, icône, regex sur le nom]] ; le dernier sous-type sans regex = « autres »
const CK_GROUPS = {
  plat:  ["Plats","🍲","Plat",[
    ["soupe","Soupes","🍜",/soupe|harira|velout|bouillon|potage|ramen|ph[ởo]\b|pho |laksa|minestrone|gaspacho|gazpacho|borscht|congee|jook|pozole|ribollita|bouillabaisse|miso|tom yum|tom kha|[cç]orbas|ajo blanco|pasta e fagioli|consomm/i],
    ["fastfood","Fast food","🍔",/burger|sandwich|b[aá]nh m[iì]|croque|hot.?dog|kebab|shawarma|gyros|souvlaki|wrap|tacos?\b|taco |birria|burrito|quesadill|nacho|fajita|enchilad|tostada|taquito|flauta|pizza|calzone|pide|piadina|panini|bagnat|arepa|poutine|sabich|arayes|chicken|karaage|g[eé]n[eé]ral tao|cordon bleu|katsu sando|fish|nuggets|chilaquiles/i],
    ["pates","Pâtes","🍝",/p[aâ]tes|pasta|conchiglion|spaghett|lasagn|penne|fettucc|tagliatell|linguine|bucatini|pappardelle|macaroni|ravioli|gnocchi|gnudi|cannelloni|tortellini|orecchiette|rigatoni|cacio|carbonara|bolognese|amatriciana|puttanesca|arrabbiata|alfredo|pastitsio|mac ?(&|and|n) ?cheese|ravioles/i],
    ["nouilles","Nouilles","🥢",/nouille|noodle|udon|soba|yakisoba|japchae|pad thai|pad see|bo bun|vermicelle|mian\b|dan dan|chow mein|lo mein|tteokbokki|biang/i],
    ["riz","Riz","🍚",/\briz\b|risotto|paella|bibimbap|nasi|donburi|katsudon|oyakodon|pilaf|koshari|mjadra|biryani|kare raisu|onigiri|sushi|kimbap|poke|fried rice|khao|spanakorizo/i],
    ["mijote","Curry & mijotés","🍛",/curry|saag|paneer|bhaji|gigantes|plaki|rajma|masala|korma|tikka|massaman|panang|phanaeng|\bdal\b|dahl|chana|aloo gobi|tajine|tagine|bourguignon|blanquette|daube|rago[uû]t|mijot|chili|cassoulet|navarin|osso|carbonnade|stroganoff|goulash|coq au vin|rougail|yassa|mole\b|barbacoa|cochinita|carnitas|couscous|choucroute|pot-au-feu|fricass|basquaise|brais|confit|kleftiko|foul|fasolakia|briam|ratatouille|caponata|imam|shakshuka|chakchouka|mapo|porc au caramel|thit kho|bœuf aux carottes|boeuf aux carottes|lathera/i],
    ["four","Gratins & tartes","🧀",/gratin|clafoutis|parmentier|moussaka|quiche|tarte|tourte|souffl|tartiflette|flammekueche|pissaladi|aligot|parmigiana|endives|tian|r[oô]ti|en crapaudine|lasagnes v|fondue|raclette|fondant sal/i],
    ["salade","Salades & bowls","🥗",/salade|bowl|tabou|fattoush|caprese|ceviche|aguachile|tartare|carpaccio|tataki|gado|som tum|ni[cç]oise|panzanella|vitello|esquites|goma-ae/i],
    ["oeufs","Œufs","🍳",/(^|[^b])[oœ]uf|omelette|huevos|tamagoyaki|frittata|kuku|brouillade|tortilla de patatas|brik/i],
    ["galette","Galettes & farcis","🫓",/galette|cr[eê]pe|jianbing|man.ouch|b[aá]nh x[eè]o|farci|mahshi|chiles|dolma|fatteh|rouleaux|bharta/i],
    ["viande","Viandes & poissons","🍗",/fritto|brochette|kefta|steak|escalope|c[oô]te|grill|plancha|teriyaki|tonkatsu|cotoletta|milanese|saltimbocca|piccata|meuni[eè]re|moules|crevette|gambas|poisson|saumon|thon|cabillaud|sole|poulet|b[oœ]uf|porc|canard|agneau|veau|tandoori|bulgogi|yakitori|satay|chich|polpette|keftedes|boulettes|laqu[eé]|kung pao|gong bao|aigre-doux|sweet and sour|tofu|seitan|tempeh/i],
    ["autre","Autres plats","🍽️"]]],
  snack: ["Snacks & entrées","🥟","Snack",[
    ["vapeur","Bao, raviolis & dim sum","🥟",/gyoza|wonton|dim sum|siu mai|har gow|jiaozi|xiao long|\bbao\b|baozi|\bpao\b|raviol|dumpling|manti|b[aá]nh cu[oố]n|b[aá]nh bao|zongzi|momo|shish barak/i],
    ["friture","Fritures & beignets","🍤",/nems?\b|samosa|beignet|bhaji|croquet|korokke|arancini|suppl[iì]|falafel|tempura|takoyaki|wu gok|pakora|fritto|ebi fry|tofu tod|chả giò|cigare|frites|patatas|batata|aloo tikki|kibbeh|wings|ailes/i],
    ["feuillete","Feuilletés & galettes","🥙",/b[öo]rek|chausson|empanada|tiropita|spanakopita|feuillet|galette|cr[eê]pe|pancake|okonomiyaki|jianbing|cong you|g[öo]zleme|man.ouch|fatayer|quesadilla|arepa|b[aá]nh x[eè]o|b[aá]nh kh[oọ]t|karipap|goug[eè]re|p[aã]o de queijo|naan|socca|pide|blini|kartoffelpuffer|gui cai|humitas|tamales/i],
    ["dip","Dips & tartinades","🥣",/houmous|hummus|baba|tzatziki|guacamole|\bdip\b|tapenade|tarama|labneh|muhammara|caviar|ktipiti|tirokafteri|skordalia|queso|melitzano|zaalouk|pico de gallo|salsa|trempette/i],
    ["street","Street food & sandwichs","🌯",/crostini|croque|b[aá]nh m[iì]|nachos|tostada|taquito|arayes|sandwich|bruschetta|toast|elotes|yakitori|satay|brochette|tteokkochi|karaage|dakgangjeong|chicken|wings|saganaki|halloumi|pissaladi|focaccia|pizza|tacos|hot.?dog|yakisoba/i],
    ["froid","Rouleaux & bouchées froides","🍙",/rouleaux|tamagoyaki|onigiri|kimbap|gimmari|maki|sushi|ceviche|tartare|edamame|crackers|chips|pois chiches r[oô]tis|tofu|concombre/i],
    ["autre","Autres snacks","🥨"]]],
  sucre: ["Sucré","🍰","Sucré",[
    ["gateaux","Gâteaux & biscuits","🎂",/g[aâ]teau|cake|cheesecake|brownie|cookie|clafoutis|fondant|biscuit|sabl[eé]|cantuccini|amaretti|langues? de chat|energy|barres?|truffe|halva|basbousa|namoura|tres leches|torta|crumble/i],
    ["boulangerie","Boulangerie & petit-déj","🥐",/croissant|chocolatine|pain au|brioche|kouign|cinnamon|roul[eé]s|pain perdu|cr[eê]pe|gaufre|pancake|dorayaki|beignet|churros|loukoumad|zeppole|\bbao\b|\bpao\b|nai wong|muffin|chausson|bougatsa|granola|porridge|bowl|toast|tartine|bagel|scone|b[aá]nh bao/i],
    ["patisserie","Pâtisserie","🧁",/tarte|tatin|macaron|[eé]clair|choux|paris-brest|profiterole|chouquette|mille-feuille|op[eé]ra|fraisier|entremets|trop[eé]zienne|baba|savarin|canel[eé]|financier|madeleine|cannoli|baklava|knafeh|galaktobour|past[eé]is|nata|dan tat|\bfar\b|pavlova|meringu|amandine|charlotte|b[uû]che|ma.amoul|portokalopita|torta della nonna|halawet/i],
    ["cremes","Crèmes & desserts frais","🍮",/mousse|cr[eè]me|panna|pudding|riz au lait|flan|zabaione|sabayon|[iî]le flottante|affogato|sorbet|glace|verrine|chia|sago|tiramisu|mochi|tao sa|haricots rouges|sticky|perles|skyr|yaourt/i]]],
  accomp:["Accompagnements","🥗","Accompagnement",[
    ["pain","Pains","🥖",/pain|focaccia|naan|pita|ciabatta|bagel|piadina|brioche/i],
    ["feculent","Féculents","🥔",/frites|pur[eé]e|riz|pommes? de terre|polenta|gratin dauphinois|aligot|patatas|sarladaise|gnocchi|semoule|boulgour|quinoa|lentilles|haricots|pois chiches|refritos/i],
    ["dip","Dips & tartinades","🥣",/houmous|hummus|baba|tzatziki|guacamole|\bdip\b|tapenade|tarama|labneh|muhammara|caviar/i],
    ["legume","Légumes & salades","🥦",/l[eé]gume|salade|taboul|gaspacho|gazpacho|dolma|blette|gratin|chou|kimchi|edamame|[eé]pinard|courgette|aubergine|haricots verts|carotte|brocoli|ratatouille|caponata|champignon|poivron|concombre/i],
    ["autre","Autres","🍽️"]]],
  sauce: ["Sauces","🫙","Sauce",[
    ["dip","Dips & tartinades","🥣",/houmous|hummus|baba|tzatziki|guacamole|dip|tapenade|tarama|labneh|muhammara|caviar|ktipiti|tirokafteri|skordalia|queso|toum|a[iï]oli|melitzano|zaalouk|pico de gallo|crema/i],
    ["huile","Huiles, pâtes & condiments","🌶️",/huile|oil|harissa|pesto|chili|piment|beurre|confit|kimchi|p[aâ]te|tao sa|ketchup|moutarde|macha/i],
    ["sauce","Sauces","🫙"]]],
};
// ordre de recherche des sous-types (le premier qui correspond gagne) et sous-type par défaut
const CK_MATCH = {sucre:{order:["patisserie","boulangerie","gateaux","cremes"], fallback:"gateaux"}};
const CK_SWEET=/cookie|g[aâ]teaux?\b(?! de riz)|\bcake|muffins?\b(?! sal| anglais)|brownie|pancakes?\b(?! sal| japonais|\/pizza)|cr[eê]pes?\b(?! sal| compl| bretonne| sarrasin| forest| [aà] la ciboule| chinoise| vietnam| croustillante| turque)|gaufre|cantuccini|amaretti|langues? de chat|biscuit|sabl[eé]s|bougatsa|churros|beignets? (?!d.oignon)|loukoumad|energy|barres?|granola|porridge|chia|pudding|brioche(?!s? vapeur)|croissant|chocolat|cinnamon|kouign|pain perdu|dorayaki|mochi|tao sa|haricots rouges douce|sago|sticky|nai wong|confiture|caramel|baklava|halva|truffe|madeleine|financier|canel|chouquette|zeppole|knafeh|ma.amoul|basbousa|skyr bowl|pomme r[oô]tie|tiramisu|sorbet|panna|mousse|smoothie bowl/i;
const CK_MEAT=/rag[uù]|bolognese|bolognaise|carbonara|amatriciana|poulet|volaille|b[oœ]uf|porc|veau|agneau|mouton|canard|dinde|lardon|jambon|bacon|saucisse|chorizo|guanciale|pancetta|prosciutto|salami|merguez|viande|hach[eé]|magret|g[eé]sier|foie|poisson|saumon|thon|cabillaud|crevette|gambas|moules?|palourde|vongole|calamar|poulpe|anchois|sardine|crabe|homard|fruits de mer|sauce (de )?poisson|nuoc|n[ưu][oớ]c m[aắ]m|fish sauce|hu[iî]tre|g[eé]latine|bouillon de (poulet|b[oœ]uf|volaille|viande)|fond de (veau|volaille)|tarama|[oœ]ufs de|bonite|dashi|katsuobushi|escargot|lapin|caille|char siu|saindoux|graisse (de canard|d.oie)|mo[eë]lle|kefta|chair|ribs|travers|oxtail|lamb|chicken|beef|pork|shrimp|bœuf|steak|escalope|côte|cuisse|pilon|blanc de/i;
const CK_ANIMAL=/\blait\b(?! de coco| d.amande| d.avoine| de soja| de riz| v[eé]g[eé]tal| de noisette)|beurre(?! de cacahu| d.amande| de cajou| de noix| de s[eé]same)|cr[eè]me(?! de coco| v[eé]g[eé]tale| de soja)|fromage|yaourt|yogourt|[oœ]ufs?\b|jaunes? d|blancs? d|miel|mozzarella|parmesan|parmigiano|pecorino|feta|ricotta|mascarpone|ghee|paneer|halloumi|ch[eè]vre|cheddar|emmental|gruy|comt[eé]|skyr|lait concentr|cream cheese|labneh|burrata|gorgonzola|reblochon|raclette|ricotta|beurre clarifi/i;
function ckClassify(r){
  const title=r.n, ings=r.i.map(x=>x[0]).join(" | ");
  let grp;
  if(r.ty==="Dessert") grp="sucre";
  else if(r.ty==="Sauce") grp="sauce";
  if(r.grpSel) grp=r.grpSel; // type choisi à la main (recette perso / modifiée)
  else if(r.ty==="Side") grp=CK_SWEET.test(title)?"sucre":"accomp";
  else if(r.ty==="Snack"||r.ty==="Breakfast") grp=CK_SWEET.test(title)?"sucre":(r.ty==="Snack"?"snack":"plat");
  else grp=CK_SWEET.test(title)&&!/poulet|porc|b[oœ]uf/i.test(title)?"sucre":"plat";
  const subs=CK_GROUPS[grp][3], rule=CK_MATCH[grp];
  const ordered = rule ? rule.order.map(k=>subs.find(s=>s[0]===k)) : subs;
  const hit = ordered.find(s=>s[3]&&s[3].test(title));
  const sub = hit ? hit[0] : (rule ? rule.fallback : subs[subs.length-1][0]);
  const vegTitle=/v[eé]g[eé]|vegan|chay\b|jay\b|sin carne/i.test(title);
  const veg = vegTitle || !CK_MEAT.test(ings+" | "+title.replace(/\(.*?\)/g,""));
  const vegan = veg && !CK_ANIMAL.test(ings);
  return {grp, sub, veg, vegan};
}
const ckSubInfo = r => CK_GROUPS[r.grp][3].find(s=>s[0]===r.sub);
const CK_CUISINES = {
  "Français":{icon:"🥖",c:["#dbe7ff","#3d5a9e"]}, "Italien":{icon:"🍝",c:["#e3f4d7","#c8372d"]},
  "Asiatique":{icon:"🥢",c:["#ffe1d6","#c0392b"]}, "Mexicain":{icon:"🌮",c:["#ffe8c2","#2f9e44"]},
  "Méditerranéen":{icon:"🫒",c:["#e9f0d2","#3f7cac"]}, "Américain":{icon:"🍔",c:["#ffe3e3","#1c4e9e"]},
  "Créole":{icon:"🌴",c:["#fff0c2","#e8590c"]}, "Autre":{icon:"🌍",c:["#efe6dc","#8a5a3c"]},
};
const CK_DIFF = {"Rapide/Facile":{icon:"⚡",label:"Rapide"}, "Typique/Traditionnel":{icon:"🏡",label:"Typique"}, "Exceptionnel/Fête":{icon:"🎉",label:"Fête"}};
const CK_COOK = {"Four":"🔥","Poêle & gril":"🍳","Wok":"🥘","Casserole":"🫕","Mijoté":"🍲","Vapeur":"♨️","Friture":"🍟","Sans cuisson":"❄️","Mixeur":"🌀","Autre":"🍽️"};

// Emoji et couleur de nourriture déduits du nom de la recette
const CK_EMO = [
 [/pizza|calzone|pide|man.ouch|flammekueche|pissaladi/i,"🍕"],[/burger/i,"🍔"],[/taco|birria|quesadill|enchilad|fajita|burrito|tostada|taquito|flauta|nachos/i,"🌮"],
 [/ramen|ph[ởo]\b|laksa|udon|soba|nouille|noodle|mian|yakisoba|japchae|pad thai|pad see|bo bun/i,"🍜"],[/soupe|velout|bouillon|minestrone|gaspacho|gazpacho|borscht|congee|pozole|ribollita|bouillabaisse|miso|tom yum|tom kha|corbas/i,"🍲"],
 [/curry|masala|dal|dahl|korma|tikka|massaman|panang|vindaloo|chana|kare/i,"🍛"],[/sushi|onigiri|kimbap|maki/i,"🍙"],[/riz|risotto|paella|bibimbap|nasi|donburi|katsudon|oyakodon|pilaf|koshari|mjadra/i,"🍚"],
 [/p[aâ]tes|spaghetti|lasagn|penne|fettuccine|bucatini|pappardelle|ravioli|gnocchi|gnudi|macaroni|tortellini|cacio|carbonara|bolognese|ragu|ragù|pastitsio/i,"🍝"],
 [/gyoza|wonton|dim sum|siu mai|har gow|jiaozi|xiao long|bao|pao|mochi|dumpling|manti|momo/i,"🥟"],[/nem|rouleau|spring roll|samosa|b[öo]rek|empanada|chausson|cigare/i,"🥠"],
 [/salade|tabou|fattoush|caprese|ceviche|aguachile|poke|bowl/i,"🥗"],[/cr[eê]pe|galette|pancake|blini|jianbing|b[aá]nh x[eè]o|okonomiyaki/i,"🥞"],[/gaufre/i,"🧇"],
 [/cookie|sabl|cantuccini|amaretti|ma.amoul|langue/i,"🍪"],[/cheesecake|g[aâ]teau|cake|fraisier|op[eé]ra|brownie|fondant|tarte|tatin|clafoutis|far |flan|basbousa|tres leches|tiramisu|roul[eé]/i,"🍰"],
 [/mousse|cr[eè]me|panna|pudding|riz au lait|zabaione|sabayon|[iî]le flottante|affogato|sorbet|glace/i,"🍮"],[/chocolat|truffe/i,"🍫"],
 [/croissant|chocolatine|pain au|brioche|kouign|cinnamon|roul[eé]s/i,"🥐"],[/pain|focaccia|ciabatta|naan|pita|bagnat|piadina|arepa|bruschetta|croque|sandwich|b[aá]nh m[iì]|toast|muffin anglais/i,"🥖"],
 [/churros|beignet|loukoumad|zeppole|chouquette|profiterole|[eé]clair|choux|paris-brest|gouger/i,"🍩"],[/macaron/i,"🍬"],[/baklava|knafeh|halawet|galaktobour|bougatsa|portokalopita/i,"🍯"],
 [/houmous|hummus|baba|tzatziki|guacamole|dip|tapenade|tarama|labneh|muhammara|caviar|melitzano|skordalia|tirokafteri|ktipiti|zaalouk|foul|pico|salsa|aïoli|aioli|toum/i,"🥣"],
 [/sauce|huile|vinaigrette|mayonnaise|b[eé]chamel|pesto|harissa|confit d.oignon|beurre|ketchup|teriyaki|hoisin|chili oil|hollandaise|b[eé]arnaise|tartare\)|tao sa|p[aâ]te de haricot|cr[eè]me p[aâ]tissi/i,"🫙"],
 [/frites|patatas|batata|pomme.? de terre|gratin|pur[eé]e|aligot|tartiflette|parmentier|r[oö]sti|tortilla de patatas|korokke/i,"🥔"],
 [/[oœ]uf|omelette|shakshuka|chakchouka|huevos|tamagoyaki|brouillade|frittata|kuku|quiche|souffl/i,"🍳"],
 [/crevette|gambas|scampi|ebi|garides/i,"🍤"],[/poisson|saumon|thon|sole|cabillaud|moules|palourde|vongole|bouillabaisse|fritto misto|pescado|tataki/i,"🐟"],
 [/poulet|chicken|karaage|yakitori|volaille|canard|dinde|cordon bleu|tandoori|tikka|teriyaki|chich|souvlaki|yassa|coq/i,"🍗"],
 [/b[oœ]uf|steak|bulgogi|bourguignon|stroganoff|kefta|keftedes|tartare|carpaccio|chili con|osso|veau|agneau|porc|cochinita|carnitas|gyros|shawarma|saucisse|rougail|choucroute|cassoulet|lard/i,"🥩"],
 [/fromage|fondue|raclette|saganaki|halloumi|queso|mac|cheese/i,"🧀"],[/tofu|tempeh|seitan|edamame/i,"🫘"],[/l[eé]gume|ratatouille|tian|briam|aubergine|courgette|chou|brocoli|[eé]pinard|poireau|imam|caponata|parmigiana/i,"🥦"],
 [/granola|porridge|avoine|energy|barre/i,"🥣"],
];
const CK_FOOD = [ // couleur de la nourriture selon les mots-clés
 [/chocolat|cacao|brownie|mole|op[eé]ra|truffe/i,["#c79a72","#5c3a21"]],[/matcha|pesto|vert|[eé]pinard|palak|spanak|basilic|herbes|taboul|kale|petits pois/i,["#cfe8b4","#4f8a3c"]],
 [/curry|dal|dahl|safran|milanese|korma|massaman|jaune|curcuma|ma[iï]s|polenta/i,["#ffe08a","#e0a020"]],[/tomate|bolognese|rag[uù]|arrabbiata|marinara|rougail|shakshuka|chakchouka|harissa|pizza|chili|piment|rouge|amatriciana|puttanesca|birria|pozole/i,["#ffb4a2","#c8372d"]],
 [/fraise|framboise|fruits rouges|cerise|betterave|grenade/i,["#ffc2cc","#c9184a"]],[/mangue|coco|sago|ananas|passion/i,["#fff0c2","#f2a541"]],[/caramel|cr[eè]me br|tatin|miel|baklava|dor[eé]/i,["#f6d6a0","#b9772e"]],
 [/citron|lemon|limoncello/i,["#fff5b0","#e6c229"]],[/poisson|crevette|saumon|thon|fruits de mer|moules/i,["#ffd9c9","#e07a5f"]],[/fromage|cheese|gratin|alfredo|carbonara|cacio|b[eé]chamel|blanquette|cr[eè]me/i,["#fff3d6","#d9b26a"]],
 [/b[oœ]uf|bourguignon|steak|agneau|braise|daube|cassoulet/i,["#d9a58a","#7a3b28"]],[/poulet|volaille|yassa|coq/i,["#ffe0b2","#c67b3a"]],
];
// Recettes compactes de chefskiss-data2.js -> même format que chefskiss-data.js
function expandCK([id,n,ty,ca,cu,d,p,c,mr,m,ings,steps]){
  const di={R:"Rapide/Facile",T:"Typique/Traditionnel",F:"Exceptionnel/Fête"}[d];
  const i=ings.split("|").map(s=>s.trim()).filter(Boolean).map(s=>{ const k=s.indexOf("="); return [s.slice(0,k).trim(), s.slice(k+1).trim()]; });
  return {id,n,ty,ca,cu,di,p,c,mr,m,op:/one.?pot/i.test(mr)?1:0,i,s:steps.split("|").map(s=>s.trim()).filter(Boolean)};
}
let CKD=null; // recettes décorées (emoji, couleurs, illustration)
function ckData(){
  if(CKD) return CKD;
  const edits=store.get("ckedits",{}), customs=store.get("ckcustom",[]);
  CKD = (window.CK||[]).concat((window.CK2||[]).map(expandCK)).map(r=>edits[r.id]?{...edits[r.id],edited:true}:r).concat(customs.map(r=>({...r,custom:true}))).map(r=>{
    const txt=r.n+" "+r.ca;
    const emo=(CK_EMO.find(([re])=>re.test(r.n))||[0,CK_TYPES[r.ty]?.icon||"🍽️"])[1];
    const food=(CK_FOOD.find(([re])=>re.test(r.n))||CK_FOOD.find(([re])=>re.test(r.i.map(x=>x[0]).join(" ")))||[0,null])[1] || (CK_CUISINES[r.cu]||CK_CUISINES.Autre).c;
    const kind = r.ca==="Soupe"||/soupe|velout|ramen|ph[ởo]\b|laksa|bouillon|congee|pozole|miso|tom yum|tom kha|minestrone|gaspacho|gazpacho|bouillabaisse|borscht/i.test(r.n) ? "soupe"
      : r.ty==="Sauce" ? "bocal"
      : (r.ty==="Dessert" && /mousse|cr[eè]me|panna|pudding|riz au lait|sago|sticky|tiramisu|zabaione|sabayon|[iî]le flottante|affogato|sorbet|glace|verrine|chia|perles|mochi|tres leches/i.test(r.n)) ? "coupe"
      : r.ty==="Dessert" ? "dessert"
      : (r.ty==="Snack" && /gyoza|wonton|dim sum|siu mai|har gow|jiaozi|xiao long|bao|pao|mochi|bánh bao|zongzi|dumpling/i.test(r.n)) ? "vapeur"
      : r.ty==="Breakfast" ? "assiette" : (r.ty==="Snack" ? "planche" : "assiette");
    return {...r, ...ckClassify(r), cook:r.c, emoji:emo, c:food, kind, t:r.p+r.c, ingTxt:r.i.map(x=>x[0]).join(" ").toLowerCase()};
  });
  return CKD;
}
const ckGet = id => ckData().find(r=>r.id===id);
const isCK = id => !!id && !R.some(r=>r.id===id) && !!ckGet(id);
const ckTime = m => m>=60 ? `${Math.floor(m/60)} h${m%60?String(m%60).padStart(2,"0"):""}` : `${m} min`;
const ckShort = n => n.replace(/\s*\(.*?\)\s*/g," ").replace(/^[^:]{2,20} : /,"").trim();
const ckSub = n => (n.match(/\(([^)]*)\)/)||[])[1]||"";
const ckGrad = r => `linear-gradient(160deg, ${r.c[0]}, ${r.c[1]})`;

/* ---------- Illustration (même style dessiné que le gobelet) ---------- */
function plateSVG(r, enter=true){
  const id="p"+(++uid), rnd=rng(r.id), c0=r.c[0], c1=r.c[1], light=mixHex(c0,"#ffffff",.35), deep=mixHex(c1,INK,.2);
  const cu=(CK_CUISINES[r.cu]||CK_CUISINES.Autre).c;
  let art="", around="";
  const steam=(xs,y)=>xs.map((x,i)=>`<path class="steam" d="M${x} ${y} q-8 -12 0 -24 q8 -12 0 -24" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round" style="--dl:${i*.5}s"/>`).join("");
  const herbs=n=>{ let s=""; for(let i=0;i<n;i++){ const x=70+rnd()*100, y=126+rnd()*26; s+=`<path class="pop" d="M${x.toFixed(1)} ${y.toFixed(1)} q6 -9 13 -3 q-6 8 -13 3z" fill="#5cb85c" stroke="${INK}" stroke-width="1.6" style="--dl:${(1+i*.07).toFixed(2)}s"/>`; } return s; };
  if(r.kind==="soupe"){
    art=`<g class="dish"><path d="M30 150 Q34 238 120 240 Q206 238 210 150 Z" fill="${cu[0]}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M40 190 Q120 206 200 190" stroke="${cu[1]}" stroke-width="7" fill="none" opacity=".75"/>
      <ellipse cx="120" cy="150" rx="90" ry="20" fill="${INK}"/><ellipse cx="120" cy="150" rx="84" ry="16" class="liqpop" fill="${c0}"/>
      <ellipse cx="120" cy="150" rx="84" ry="16" fill="url(#${id}hd)"/>
      ${[0,1,2,3,4].map(i=>`<circle class="pop" cx="${(62+i*28+rnd()*8).toFixed(1)}" cy="${(146+rnd()*8).toFixed(1)}" r="${(4+rnd()*3).toFixed(1)}" fill="${i%2?c1:light}" stroke="${INK}" stroke-width="1.5" style="--dl:${(.9+i*.08).toFixed(2)}s"/>`).join("")}
      ${herbs(4)}<path d="M96 246 h48 l-6 10 h-36z" fill="${cu[0]}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      ${r.cu==="Asiatique"
        ? `<g class="chop"><rect x="150" y="58" width="7" height="100" rx="3" transform="rotate(24 153 108)" fill="#e9c46a" stroke="${INK}" stroke-width="2.5"/><rect x="166" y="62" width="7" height="100" rx="3" transform="rotate(30 169 112)" fill="#e9c46a" stroke="${INK}" stroke-width="2.5"/></g>`
        : `<g class="chop"><path d="M150 146 L186 70" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M150 146 L186 70" stroke="#d9d9d9" stroke-width="5" stroke-linecap="round"/><ellipse cx="190" cy="62" rx="10" ry="14" transform="rotate(25 190 62)" fill="#d9d9d9" stroke="${INK}" stroke-width="3"/></g>`}</g>`;
    around=steam([88,120,152],120);
  } else if(r.kind==="coupe"){
    art=`<g class="dish"><path d="M104 214 L108 244 H132 L136 214Z" fill="#fff" fill-opacity=".5" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="120" cy="248" rx="42" ry="9" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
      <path d="M44 100 Q48 212 120 216 Q192 212 196 100 Z" fill="#fff" fill-opacity=".35"/>
      <clipPath id="${id}cc"><path d="M44 100 Q48 212 120 216 Q192 212 196 100 Z"/></clipPath>
      <g clip-path="url(#${id}cc)"><g class="slice"><path d="M48 150 Q54 210 120 213 Q186 210 192 150 Z" fill="${c1}"/><path d="M47 128 Q120 140 193 128 L192 150 Q120 162 48 150Z" fill="${light}"/>
      <path d="M45 108 Q120 120 195 108 L193 128 Q120 140 47 128Z" fill="${mixHex(c0,"#fff",.6)}"/>
      <path d="M48 150 Q54 210 120 213 Q186 210 192 150 Z" fill="url(#${id}hd)"/></g></g>
      <path d="M44 100 Q48 212 120 216 Q192 212 196 100 Z" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="120" cy="100" rx="76" ry="12" fill="${light}" stroke="${INK}" stroke-width="3.5"/>
      <path d="M58 116 L70 196" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>
      <g class="cream">${[0,1,2,3,4].map(i=>`<circle cx="${(78+i*21).toFixed(0)}" cy="${(96-(i%2)*4).toFixed(0)}" r="${(8+rnd()*4).toFixed(1)}" fill="${i%2?c0:c1}" stroke="${INK}" stroke-width="2"/>`).join("")}
      <path d="M122 78 q-12 -4 -6 -16 q2 -14 16 -10 q12 4 4 18z" fill="#fffaf2" stroke="${INK}" stroke-width="2.6"/>
      <circle cx="124" cy="52" r="8" fill="#d62839" stroke="${INK}" stroke-width="2.6"/><path d="M124 44 q4 -12 14 -14" stroke="${INK}" stroke-width="2.2" fill="none"/>
      <path d="M150 88 L176 40" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M150 88 L176 40" stroke="#e9c46a" stroke-width="3.5" stroke-linecap="round"/></g></g>`;
  } else if(r.kind==="dessert"){
    art=`<g class="dish"><ellipse cx="120" cy="236" rx="96" ry="18" fill="#fff" stroke="${INK}" stroke-width="4"/>
      <g class="slice"><path d="M48 228 L196 228 L196 150 L48 112 Z" fill="${light}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M48 172 L196 196" stroke="${c1}" stroke-width="10"/><path d="M48 140 L196 172" stroke="${mixHex(c0,"#fff",.6)}" stroke-width="7"/>
      <path d="M196 150 L196 228" stroke="${INK}" stroke-width="4"/><path d="M48 112 L196 150 L196 228" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M44 112 Q60 96 80 108 Q98 98 116 114 Q136 106 152 124 Q172 118 198 150 L48 116Z" fill="${c1}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g>
      <g class="cream"><path d="M104 104 q-14 -2 -10 -14 q-2 -14 14 -14 q4 -14 16 -6 q14 0 8 16 q8 12 -8 16z" fill="#fffaf2" stroke="${INK}" stroke-width="3"/>
      <circle cx="118" cy="66" r="8" fill="#d62839" stroke="${INK}" stroke-width="2.6"/><path d="M118 58 q4 -12 14 -14" stroke="${INK}" stroke-width="2.2" fill="none"/></g></g>`;
  } else if(r.kind==="bocal"){
    art=`<g class="dish"><rect x="66" y="96" width="108" height="138" rx="22" fill="${c0}" stroke="${INK}" stroke-width="4"/>
      <rect x="66" y="96" width="108" height="138" rx="22" fill="url(#${id}hd)"/>
      <rect x="84" y="138" width="72" height="44" rx="8" fill="#fffaf0" stroke="${INK}" stroke-width="3"/><text x="120" y="167" text-anchor="middle" font-size="24">${r.emoji}</text>
      <path d="M80 112 L86 214" stroke="#fff" stroke-opacity=".6" stroke-width="7" stroke-linecap="round"/>
      <g class="lid"><rect x="70" y="72" width="100" height="28" rx="7" fill="${cu[1]}" stroke="${INK}" stroke-width="4"/><path d="M78 86 H162" stroke="${INK}" stroke-opacity=".4" stroke-width="2"/></g>
      <path d="M150 232 q6 14 -4 22" stroke="${c1}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
  } else if(r.kind==="vapeur"){
    art=`<g class="dish"><path d="M34 160 H206 V222 Q206 236 192 236 H48 Q34 236 34 222Z" fill="#e3b778" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      ${[52,82,112,142,172].map(x=>`<path d="M${x} 166 V230" stroke="${INK}" stroke-opacity=".35" stroke-width="2"/>`).join("")}
      ${[0,1,2].map(i=>`<g class="pop" style="--dl:${(1+i*.12).toFixed(2)}s"><path d="M${62+i*44} 160 Q${62+i*44} 120 ${84+i*44} 116 Q${106+i*44} 120 ${106+i*44} 160Z" fill="${light}" stroke="${INK}" stroke-width="3"/><path d="M${76+i*44} 124 q8 8 16 0" stroke="${INK}" stroke-width="2" fill="none"/></g>`).join("")}
      <g class="lid"><path d="M28 110 Q120 40 212 110 Z" fill="#d9a85c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="104" y="58" width="32" height="14" rx="6" fill="#b5803b" stroke="${INK}" stroke-width="3"/></g></g>`;
    around=steam([84,120,156],70);
  } else if(r.kind==="planche"){
    art=`<g class="dish"><rect x="26" y="186" width="188" height="44" rx="14" fill="#c98b4f" stroke="${INK}" stroke-width="4"/><circle cx="198" cy="208" r="7" fill="#fff8f1" stroke="${INK}" stroke-width="3"/>
      ${[0,1,2,3].map(i=>`<g class="pop" style="--dl:${(.8+i*.12).toFixed(2)}s"><ellipse cx="${62+i*38}" cy="${176-(i%2)*10}" rx="22" ry="17" fill="${i%2?c0:light}" stroke="${INK}" stroke-width="3"/><path d="M${52+i*38} ${172-(i%2)*10} q10 -8 20 0" stroke="${c1}" stroke-width="3" fill="none"/></g>`).join("")}
      <g class="cream"><path d="M150 150 q2 -26 26 -28 q24 2 26 28z" fill="${c1}" stroke="${INK}" stroke-width="3"/><ellipse cx="176" cy="150" rx="28" ry="8" fill="#fff" stroke="${INK}" stroke-width="3"/></g></g>`;
  } else { // assiette
    let food=`<path class="mound" d="M62 170 Q66 118 102 112 Q120 92 142 110 Q178 116 180 170 Z" fill="${c0}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path class="mound" d="M62 170 Q66 118 102 112 Q120 92 142 110 Q178 116 180 170 Z" fill="url(#${id}hd)"/>`;
    for(let i=0;i<6;i++){ const x=78+rnd()*82, y=122+rnd()*36; food+=`<ellipse class="pop" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(7+rnd()*5).toFixed(1)}" ry="${(5+rnd()*3).toFixed(1)}" fill="${i%2?c1:deep}" stroke="${INK}" stroke-width="1.8" style="--dl:${(.9+i*.07).toFixed(2)}s"/>`; }
    art=`<g class="dish"><ellipse cx="120" cy="182" rx="104" ry="44" fill="${cu[0]}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="120" cy="178" rx="78" ry="30" fill="#fffdf8" stroke="${INK}" stroke-width="2.5" stroke-opacity=".5"/>
      <path d="M30 186 Q120 236 210 186" stroke="${cu[1]}" stroke-width="5" fill="none" opacity=".7"/>
      <g class="food">${food}${herbs(5)}</g>
      <g class="chop"><path d="M222 120 v90" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M222 120 v90" stroke="#d9d9d9" stroke-width="4" stroke-linecap="round"/>
      <path d="M14 120 v90" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M14 120 v90" stroke="#d9d9d9" stroke-width="4" stroke-linecap="round"/><path d="M8 118 v24 M14 118 v24 M20 118 v24" stroke="${INK}" stroke-width="2.5"/></g></g>`;
    if(r.cook>=15 && rnd()<.8) around=steam([96,124,152],108);
  }
  const sparks=[[26,64,1],[214,72,.85],[30,250,.7],[212,250,.75]].map(([x,y,s],i)=>
    `<path class="spark" d="${STAR}" transform="translate(${x} ${y}) scale(${s})" fill="#f6d365" stroke="${INK}" stroke-width="2" style="--dl:${i*.5}s"/>`).join("");
  let ground=""; for(let i=0;i<6;i++){ const x=40+rnd()*160, y=262+rnd()*10, rx=3+rnd()*6; ground+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx*.45).toFixed(1)}" fill="${i%2?c1:cu[1]}" opacity=".8"/>`; }
  return `<svg viewBox="0 0 240 280" role="img" aria-label="${esc(r.n)}" class="platesvg k-${r.kind}${enter?" enter":""}">
    <defs><pattern id="${id}hd" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".95" fill="${INK}" opacity=".2"/></pattern></defs>
    <ellipse cx="120" cy="262" rx="90" ry="8" fill="${INK}" opacity=".07"/>${ground}
    ${art}${around}${sparks}</svg>`;
}

/* ---------- Accueil ---------- */
function ckPickRandom(){
  const D=ckData(); let r;
  do { r=D[Math.floor(Math.random()*D.length)]; } while(D.length>1 && r.id===state.ckRandom);
  state.ckRandom=r.id;
  const others=D.filter(x=>x.id!==r.id).sort(()=>Math.random()-.5);
  const near=others.filter(x=>x.grp===r.grp && x.sub===r.sub);
  state.ckPicks=[...new Set([...near.slice(0,4),...others.filter(x=>x.grp===r.grp),...others])].slice(0,6).map(x=>x.id);
}
function ckBadges(r){
  const cu=CK_CUISINES[r.cu]||CK_CUISINES.Autre, d=CK_DIFF[r.di];
  return `<span class="badge">${cu.icon} ${r.cu}</span><span class="badge">⏱ ${ckTime(r.t)}</span><span class="badge">${d.icon} ${d.label}</span>`;
}
function ckHome(){
  if(!state.ckRandom || !ckGet(state.ckRandom)) ckPickRandom();
  const r=ckGet(state.ckRandom), enterNow=state.enter!==false; state.enter=false;
  const picks=(state.ckPicks||[]).map(ckGet).filter(Boolean);
  return `<div class="home">
    <section class="stage" style="--halo:${halo(r)}">
      <div class="kicker">🎲 Le plat du moment · ${ckSubInfo(r)[1]}</div>
      ${ckPhoto(r)
        ? `<button class="photowrap${enterNow?" enter":""}" id="cup" aria-label="Changer de plat"><span class="ph-fb" style="background:${ckGrad(r)}">${r.emoji}</span><img src="${ckPhoto(r)}" alt="${esc(ckShort(r.n))}" onerror="this.remove()"><span class="ph-credit">📷 ${((window.CKP||{})[r.id]||{}).g?"Photo d’illustration · ":""}${esc(((window.CKP||{})[r.id]||{}).a||"Wikimedia Commons")}</span></button>`
        : `<button class="cupwrap platewrap" id="cup" aria-label="Changer de plat">${plateSVG(r, enterNow)}</button>`}
      <h1>${r.emoji} ${esc(ckShort(r.n))}</h1>${ckSub(r.n)?`<div class="ksub">${esc(ckSub(r.n))}</div>`:""}
      <p>${CK_COOK[r.m]||"🍽️"} ${esc(r.mr)}${r.op?" · 🫕 One pot":""} · ${r.i.length} ingrédients</p>
      <div class="badges">${ckBadges(r)}</div>
      <div class="cta">
        <button class="btn" data-open="${r.id}">Je le cuisine !</button>
        <button class="btn alt" id="reroll" aria-label="Un autre">🎲</button>
      </div>
      <div class="hint">Touche l'assiette pour en changer</div>
    </section>
    <aside class="side ${state.side?"":"closed"}">
      <button class="handle" id="toggleSide" aria-label="Ça pourrait te plaire"><b>›</b>${state.side?"":'<span class="vlabel">Ça pourrait te plaire</span>'}</button>
      <div class="list">${picks.map(p=>`<button class="mini" data-open="${p.id}"><span class="dot" style="background:${ckGrad(p)}">${ckImg(p,120)}${p.emoji}</span>${esc(p.n.replace(/\s*\(.*\)/,""))}</button>`).join("")}</div>
    </aside>
  </div>`;
}

/* ---------- Liste ---------- */
function ckCard(r){
  const cu=CK_CUISINES[r.cu]||CK_CUISINES.Autre;
  return `<button class="card" data-open="${r.id}">
    <div class="sw" style="background:${ckGrad(r)}">${ckImg(r,330)}${r.emoji}<span class="tx">${cu.icon}</span></div>
    <h3>${favs.has(r.id)?"❤️ ":""}${esc(r.n.replace(/\s*\(.*\)/,""))}</h3>
    <div class="d">⏱ ${ckTime(r.t)} · ${CK_DIFF[r.di].icon} ${CK_DIFF[r.di].label}${r.op?" · 🫕":""}</div>
  </button>`;
}
const scrollRow = inner => `<div class="scroller"><button class="arr l" data-arr="-1" aria-label="Précédent">‹</button><div class="chips">${inner}</div><button class="arr r" data-arr="1" aria-label="Suivant">›</button></div>`;
function ckList(onlyFavs){
  const D=ckData(), f=state.ckf||(state.ckf={});
  f.grp=f.grp||"tous"; f.sub=f.sub||"tous"; f.reg=f.reg||"tous"; f.cu=f.cu||"toutes"; f.di=f.di||"toutes"; f.m=f.m||"toutes";
  let list = onlyFavs ? D.filter(r=>favs.has(r.id)) : D;
  if(f.grp!=="tous") list=list.filter(r=>r.grp===f.grp);
  if(f.grp!=="tous" && f.sub!=="tous") list=list.filter(r=>r.sub===f.sub);
  if(f.reg==="veg") list=list.filter(r=>r.veg); else if(f.reg==="vegan") list=list.filter(r=>r.vegan);
  if(f.cu!=="toutes") list=list.filter(r=>r.cu===f.cu);
  if(f.di!=="toutes") list=list.filter(r=>r.di===f.di);
  if(f.m==="onepot") list=list.filter(r=>r.op); else if(f.m!=="toutes") list=list.filter(r=>r.m===f.m);
  const q=state.q.trim().toLowerCase();
  if(q) list=list.filter(r=>(r.n+" "+r.cu+" "+r.ingTxt).toLowerCase().includes(q));
  const lim=state.ckLimit||60, shown=list.slice(0,lim);
  const chip=(k,v,label)=>`<button class="chip ${f[k]===v?"on":""}" data-ckf="${k}:${v}">${label}</button>`;
  const cuisines=Object.keys(CK_CUISINES).filter(c=>D.some(r=>r.cu===c));
  return `
  <div class="title"><h2>${onlyFavs?"Mes favoris":"Recettes"}</h2><span class="muted">${list.length} recette${list.length>1?"s":""}</span></div>
  ${onlyFavs?"":`<div class="row2" style="margin:0 0 10px"><button class="btn" id="ckNew">＋ Créer</button><button class="btn alt2" id="impOpen">📥 Importer</button></div>`}
  <input id="search" class="search" type="search" placeholder="🔎 Un plat, un ingrédient… (ex : poulet, coco)" value="${esc(state.q)}">
  <div class="fpanel">
    <div class="frow"><div class="flabel">Type</div>${scrollRow(chip("grp","tous","Tous")+Object.entries(CK_GROUPS).map(([k,g])=>chip("grp",k,g[1]+" "+g[0])).join(""))}</div>
    ${f.grp!=="tous"?`<div class="frow"><div class="flabel">${CK_GROUPS[f.grp][0]}</div>${scrollRow(chip("sub","tous","Tous")+CK_GROUPS[f.grp][3].filter(s=>D.some(r=>r.grp===f.grp&&r.sub===s[0])).map(s=>chip("sub",s[0],s[2]+" "+s[1])).join(""))}</div>`:""}
    <div class="frow"><div class="flabel">Régime</div>${scrollRow(chip("reg","tous","Tout")+chip("reg","veg","🌱 Végétarien")+chip("reg","vegan","🌿 Vegan"))}</div>
    <div class="frow"><div class="flabel">Cuisine</div>${scrollRow(chip("cu","toutes","Toutes")+cuisines.map(c=>chip("cu",c,CK_CUISINES[c].icon+" "+c)).join(""))}</div>
    <div class="frow"><div class="flabel">Difficulté</div>${scrollRow(chip("di","toutes","Toutes")+Object.entries(CK_DIFF).map(([k,v])=>chip("di",k,v.icon+" "+v.label)).join(""))}</div>
    <div class="frow"><div class="flabel">Cuisson</div>${scrollRow(chip("m","toutes","Toutes")+chip("m","onepot","🫕 One pot")+Object.entries(CK_COOK).filter(([k])=>D.some(r=>r.m===k)).map(([k,v])=>chip("m",k,v+" "+k)).join(""))}</div>
  </div>
  ${shown.length ? `<div class="grid">${shown.map(ckCard).join("")}</div>` :
    `<div class="empty">${onlyFavs && !D.some(r=>favs.has(r.id)) ? "Aucun plat en favori pour l'instant.<br>Touche 🤍 sur une recette !" : "Aucune recette ne correspond 🤷"}</div>`}
  ${list.length>lim?`<button class="btn" id="ckMore" style="width:100%;margin-top:14px">Voir plus (${list.length-lim} restantes)</button>`:""}`;
}

/* ---------- Photos (Wikipédia / Wikimedia Commons, licences libres) ---------- */
// chefskiss-photos.js : window.CKP = {id: {i: vignette, f: fichier, a: auteur, l: licence, p: page source}}
// tailles standard servies par Wikimedia : 120, 250, 330, 500, 960…
// photos hébergées avec l'app (photos/), sinon vignette Wikimedia
// copie intégrée à l'APK (file://) : les photos ne sont pas embarquées, on les prend en ligne
const PHOTO_BASE = location.protocol==="file:" ? "https://exciid.github.io/shakies/" : "";
const ckPhoto = (r, w=500) => { if(r.photo) return r.photo; const p=(window.CKP||{})[r.id]; return !p ? null : p.s ? PHOTO_BASE+p.s : p.i.split("?")[0].replace(/\/\d+px-/, `/${w}px-`); };
const ckImg = (r, w) => { const u=ckPhoto(r,w); return u ? `<img class="ph" src="${u}" loading="lazy" alt="" onerror="this.remove()">` : ""; };
function ckCredit(r){
  if(r.photo) return "📷 Ta photo";
  const p=(window.CKP||{})[r.id]; if(!p) return "";
  const file="https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(p.f);
  return `📷 ${p.g?"Photo d’illustration (plat proche) · ":""}${p.a?esc(p.a)+" · ":""}${p.l?esc(p.l)+" · ":""}<a href="${file}" target="_blank" rel="noopener">Wikimedia Commons</a>`;
}

/* ---------- Page recette ---------- */
function ckDetail(id){
  const r=ckGet(id), inCourses=(state.ckPick||[]).includes(id), photo=ckPhoto(r,960);
  return `
  ${photo?`<figure class="ckphoto"><img src="${photo}" alt="${esc(ckShort(r.n))}" onerror="this.parentNode.remove()"><figcaption>${ckCredit(r)}</figcaption></figure>`:""}
  <section class="dhero" style="--halo:${halo(r)}">
    ${ckPhoto(r)?"":`<div class="cupwrap platewrap">${plateSVG(r)}</div>`}
    <div>
      <h1>${esc(r.n)}</h1>
      <p>${ckSubInfo(r)[2]} ${CK_GROUPS[r.grp][2]} · ${ckSubInfo(r)[1]}${r.vegan?" · 🌿 Vegan":r.veg?" · 🌱 Végétarien":""}</p>
      <div class="badges" style="justify-content:flex-start;margin:0">${ckBadges(r)}
        <button class="fav" id="fav">${favs.has(r.id)?"❤️ Favori":"🤍 Favori"}</button>
        <button class="fav" data-ckadd="${r.id}">${inCourses?"🛒 Dans les courses ✓":"🛒 + Courses"}</button>
        <button class="fav" data-ckedit="${r.id}">✏️ Modifier</button>
        ${r.custom?`<button class="fav" data-ckdel="${r.id}">🗑️</button>`:""}
        ${r.edited?`<button class="fav" data-ckrevert="${r.id}">↺ Recette d'origine</button>`:""}
        ${r.src?`<a class="fav srclink" href="${esc(r.src)}" target="_blank" rel="noopener">🔗 Vidéo source</a>`:""}</div>
    </div>
  </section>
  <div class="panel">
    <div class="prep">
      <div>Préparation<b>${ckTime(r.p)}</b></div><div>Cuisson<b>${r.cook?ckTime(r.cook):"—"}</b></div><div>Mode<b>${CK_COOK[r.m]||""} ${r.m}</b></div>
    </div>
    <p class="muted" style="font-size:.8rem;margin:0">${CK_COOK[r.m]||"🍽️"} ${esc(r.mr)}${r.op?" · 🫕 Tout cuit dans un seul récipient":""}</p>
  </div>
  <div class="panel">
    <h3>Ingrédients <span class="muted" style="font:500 .75rem Inter">${r.i.length} · touche pour cocher</span></h3>
    <ul class="ing">${r.i.map(([item,q])=>`<li><span class="box">✓</span><span class="q">${esc(q||"—")}</span><span>${esc(item)}</span></li>`).join("")}</ul>
  </div>
  <div class="panel">
    <h3>Préparation <span class="muted" style="font:500 .75rem Inter">${r.s.length} étapes · touche pour cocher</span></h3>
    <ol class="ing steps-ck">${r.s.map((s,k)=>`<li><span class="box num">${k+1}</span><span>${esc(s)}</span></li>`).join("")}</ol>
  </div>
  <p class="muted" style="font-size:.72rem;text-align:center;margin:14px 0 0">Quantités de la recette d'origine (pas de nombre de parts indiqué).</p>`;
}

/* ---------- Courses : plats de la semaine ---------- */
const CK_RAYONS=["🥬 Fruits & légumes","🥩 Boucherie","🐟 Poissonnerie","🥛 Frais","🥫 Épicerie","🧂 Placard (vérifie que tu en as)"];
function ckRayon(n){
  n=n.toLowerCase();
  if(/lait de coco|cr[eè]me de coco/.test(n)) return CK_RAYONS[4];
  if(/sel\b|poivre|[eé]pice|cumin|paprika|cannelle|curcuma|muscade|origan|thym s[eé]ch|laurier|huile|vinaigre|sucre|farine|levure|bicarbonate|ma[iï]zena|f[eé]cule|sauce soja|nuoc|extrait|vanille|piment en poudre|herbes de provence|cardamome|girofle|badiane|anis|eau\b/.test(n)) return CK_RAYONS[5];
  if(/poulet|volaille|b[oœ]uf|porc|veau|agneau|canard|lardon|jambon|bacon|saucisse|chorizo|guanciale|pancetta|viande|hach[eé]|escalope|magret|g[eé]sier|merguez|dinde|c[oô]te|filet mignon|prosciutto|lapin|confit/.test(n)) return CK_RAYONS[1];
  if(/poisson|crevette|saumon|thon|cabillaud|moule|palourde|calamar|poulpe|sole|crabe|homard|anchois|sardine|bar\b|dorade|fruits de mer|tarama|œufs de|oeufs de/.test(n)) return CK_RAYONS[2];
  if(/lait\b|lait (entier|demi)|cr[eè]me|beurre|fromage|yaourt|[oœ]uf|mozzarella|parmesan|parmigiano|pecorino|feta|ricotta|mascarpone|cream cheese|philadelphia|comt[eé]|gruy|emmental|ch[eè]vre|cheddar|halloumi|paneer|tofu|labneh|skyr|cottage|reblochon|burrata/.test(n)) return CK_RAYONS[3];
  if(/tomate|oignon|[eé]chalote|ail\b|carotte|pomme|courgette|aubergine|poivron|champignon|salade|laitue|persil|coriandre|basilic|menthe|ciboule|ciboulette|aneth|citron|lime|gingembre|chou|[eé]pinard|avocat|mangue|banane|concombre|c[eé]leri|poireau|navet|patate|potiron|courge|haricot vert|petit.? pois|brocoli|fenouil|radis|piment frais|piment vert|jalape|fruit|fraise|framboise|cerise|poire|orange|ananas|herbe|thym frais|romarin|sauge|estragon|taro|soja frais|pousses|betterave|ma[iï]s frais|endive|blette|asperge|artichaut|figue/.test(n)) return CK_RAYONS[0];
  return CK_RAYONS[4];
}
const ckNormItem = s => s.replace(/\s*\(.*?\)\s*/g," ").replace(/\s+/g," ").trim();
function ckParseQty(q){
  const m=String(q).replace(",",".").match(/^\s*(\d+(?:\.\d+)?)(?:\s*(?:à|-)\s*\d+(?:\.\d+)?)?\s*(kg|g|mg|l|cl|dl|ml|c[aà]s|c\.? ?[aà] ?s\.?|c[aà]c|c\.? ?[aà] ?c\.?|pi[eè]ces?|gousses?|tranches?|feuilles?|brins?|bottes?|pinc[eé]es?|poign[eé]es?|sachets?|bo[iî]tes?|bocaux?|verres?|tasses?|bols?|cuill[eè]res?)?\b/i);
  if(!m) return null;
  let v=+m[1], u=(m[2]||"pc").toLowerCase();
  if(u==="kg"){v*=1000;u="g";} else if(u==="mg"){v/=1000;u="g";} else if(u==="l"){v*=1000;u="ml";} else if(u==="cl"){v*=10;u="ml";} else if(u==="dl"){v*=100;u="ml";}
  else if(/^c.?.?[aà].?s|^c[aà]s/.test(u)) u="c. à s."; else if(/^c.?.?[aà].?c|^c[aà]c/.test(u)) u="c. à c.";
  else if(/^pi[eè]ce/.test(u)) u="pc"; else u=u.replace(/s$/,"");
  return {v,u};
}
/* ---------- Courses : liste unique shakies + plats, en unités d'achat ---------- */
const BOU="🥩 Boucherie", POI="🐟 Poissonnerie";
const ALL_RAYONS=[CK_RAYONS[0],BOU,POI,"❄️ Surgelés",CK_RAYONS[3],CK_RAYONS[4],CK_RAYONS[5]];
// [regex, clé, nom, rayon, unité de base (g|ml|pc), taille du lot, mot (1), mot (plusieurs), prix indicatif métropole, poids d'une pièce en g]
// clé "placard" = à vérifier au placard ; clé "=xxx" = article du catalogue Shakies
const BUY = [
 [/levure|bicarbonate|ma[iï]zena|f[eé]cule|g[eé]latine|agar|bouillon|cubes? de bouillon|\bsel\b|fleur de sel|poivre(?! vert frais)|[eé]pices?|cumin|paprika|curry en poudre|garam|piment (en poudre|d.espelette|de cayenne)|herbes de provence|origan|muscade|cannelle|curcuma|gingembre en poudre|cardamome|girofle|badiane|anis|huile|vinaigre|sauce soja|soja sal|nuoc|sauce (de poisson|d.hu[iî]tre|worcester)|mirin|sak[eé]|moutarde|ketchup|extrait|ar[oô]me|colorant|s[eé]same|\bthym|romarin|laurier|sauge s[eé]ch|zaatar|sumac|five spice|cinq [eé]pices|glutamate|eau de fleur/i,"placard"],
 [/cream cheese|philadelphia|st m[oô]ret|fromage frais/i,"=cream"],
 [/beurre(?! de cacahu| d.amande| de cajou)/i,"beurre","Beurre",CK_RAYONS[3],"g",200,"bloc de 200 g","blocs de 200 g",2.2],
 [/farine/i,"farine","Farine",CK_RAYONS[4],"g",1000,"paquet de 1 kg","paquets de 1 kg",1.0],
 [/sucre glace/i,"sucreglace","Sucre glace",CK_RAYONS[4],"g",500,"paquet de 500 g","paquets de 500 g",1.5],
 [/cassonade|sucre (roux|brun|complet|de canne)|vergeoise|muscovado/i,"cassonade","Sucre roux",CK_RAYONS[4],"g",750,"paquet","paquets",2.0],
 [/sucre(?! vanill)/i,"sucre","Sucre",CK_RAYONS[4],"g",1000,"paquet de 1 kg","paquets de 1 kg",1.2],
 [/(^|[^b])(œ|oe)ufs?\b/i,"oeufs","Œufs",CK_RAYONS[3],"pc",6,"boîte de 6","boîtes de 6",2.4,55],
 [/pommes? de terre|patates?(?! douce)|grenaille/i,"pdt","Pommes de terre",CK_RAYONS[0],"g",1000,"sac de 1 kg","sacs de 1 kg",1.5,150],
 [/patates? douces?/i,"patatedouce","Patates douces",CK_RAYONS[0],"g",1000,"kg","kg",2.8,300],
 [/[eé]chalote/i,"echalote","Échalotes",CK_RAYONS[0],"pc",1,"","",0.3,25],
 [/ciboule|oignons? verts?|c[eé]bette|ciboulette|oignons? nouveaux/i,"ciboule","Ciboule / ciboulette",CK_RAYONS[0],"pc",1,"botte","bottes",1.2,40],
 [/oignon/i,"oignon","Oignons",CK_RAYONS[0],"pc",1,"","",0.3,150],
 [/\bail\b|gousses? d.ail/i,"ail","Ail",CK_RAYONS[0],"pc",10,"tête d'ail","têtes d'ail",0.6,5],
 [/tomates? cerises?/i,"tomcerise","Tomates cerises",CK_RAYONS[0],"g",250,"barquette de 250 g","barquettes de 250 g",2.0,15],
 [/concentr[eé] de tomate|pur[eé]e de tomate/i,"concentre","Concentré de tomate",CK_RAYONS[4],"g",140,"petite boîte","petites boîtes",0.8],
 [/pulpe|concass|tomates? pel[eé]es|coulis de tomate|passata|sauce tomate|tomates en bo/i,"tomboite","Tomates en boîte (pulpe, concassées)",CK_RAYONS[4],"g",400,"boîte de 400 g","boîtes de 400 g",1.0],
 [/tomate/i,"tomate","Tomates",CK_RAYONS[0],"pc",1,"","",0.4,120],
 [/courgette/i,"courgette","Courgettes",CK_RAYONS[0],"pc",1,"","",0.6,200],
 [/aubergine/i,"aubergine","Aubergines",CK_RAYONS[0],"pc",1,"","",1.0,300],
 [/poivron/i,"poivron","Poivrons",CK_RAYONS[0],"pc",1,"","",0.8,150],
 [/champignon|shiitake|pleurote|c[eè]pe|porcini|girolle/i,"champi","Champignons",CK_RAYONS[0],"g",250,"barquette de 250 g","barquettes de 250 g",2.0,20],
 [/salade|laitue|roquette|mesclun|romaine|m[aâ]che/i,"salade","Salade",CK_RAYONS[0],"pc",1,"","",1.2,200],
 [/chou-fleur|chou fleur/i,"choufleur","Chou-fleur",CK_RAYONS[0],"pc",1,"","",2.0,800],
 [/brocoli/i,"brocoli","Brocoli",CK_RAYONS[0],"pc",1,"","",1.5,400],
 [/\bchou\b|chou chinois|pak ?cho/i,"chou","Chou",CK_RAYONS[0],"pc",1,"","",1.5,800],
 [/poireau/i,"poireau","Poireaux",CK_RAYONS[0],"pc",1,"","",0.8,200],
 [/c[eé]leri/i,"celeri","Céleri",CK_RAYONS[0],"pc",1,"","",1.5,300],
 [/persil|coriandre|aneth|estragon|cerfeuil|herbes fra/i,"herbes","Herbes fraîches (persil, coriandre…)",CK_RAYONS[0],"pc",1,"botte","bottes",1.0,30],
 [/haricots? verts?/i,"haricotsverts","Haricots verts",CK_RAYONS[0],"g",500,"sachet de 500 g","sachets de 500 g",2.5],
 [/petits? pois|edamame/i,"petitspois","Petits pois / edamame",ALL_RAYONS[3],"g",1000,"sachet surgelé de 1 kg","sachets de 1 kg",2.2],
 [/ma[iï]s/i,"mais","Maïs",CK_RAYONS[4],"g",300,"boîte","boîtes",1.0],
 [/pois chiches?/i,"poischiche","Pois chiches",CK_RAYONS[4],"g",400,"boîte de 400 g","boîtes de 400 g",1.0],
 [/lentilles?/i,"lentilles","Lentilles",CK_RAYONS[4],"g",500,"paquet de 500 g","paquets de 500 g",1.8],
 [/haricots? (rouges?|noirs?|blancs?|azuki|mungo)|f[eè]ves/i,"haricots","Haricots / fèves",CK_RAYONS[4],"g",400,"boîte de 400 g","boîtes de 400 g",1.0],
 [/riz gluant/i,"rizgluant","Riz gluant",CK_RAYONS[4],"g",1000,"paquet de 1 kg","paquets de 1 kg",3.0],
 [/\briz\b/i,"riz","Riz",CK_RAYONS[4],"g",1000,"paquet de 1 kg","paquets de 1 kg",2.0],
 [/lasagne/i,"lasagne","Feuilles de lasagne",CK_RAYONS[4],"g",500,"paquet","paquets",1.8],
 [/spaghett|p[aâ]tes(?! [aà] (pizza|choux|tartiner|sabl|bris|feuillet))|penne|fusilli|tagliatell|fettucc|linguine|bucatini|pappardelle|macaroni|rigatoni|orecchiette|conchiglie|farfalle/i,"pates","Pâtes",CK_RAYONS[4],"g",500,"paquet de 500 g","paquets de 500 g",1.2],
 [/nouilles?|vermicelles?|udon|soba|ramen/i,"nouilles","Nouilles",CK_RAYONS[4],"g",250,"paquet de 250 g","paquets de 250 g",1.8],
 [/semoule|couscous|boulgour|quinoa|polenta/i,"semoule","Semoule / boulgour / quinoa",CK_RAYONS[4],"g",500,"paquet de 500 g","paquets de 500 g",1.5],
 [/chapelure|panko/i,"chapelure","Chapelure / panko",CK_RAYONS[4],"g",250,"paquet","paquets",1.5],
 [/p[aâ]te (feuillet|bris|sabl|[aà] pizza)/i,"pateroul","Pâte à étaler (feuilletée, brisée…)",CK_RAYONS[3],"pc",1,"rouleau","rouleaux",1.5,230],
 [/phyllo|filo|brick/i,"filo","Feuilles de filo / brick",CK_RAYONS[3],"pc",10,"paquet","paquets",2.5],
 [/tortilla/i,"tortilla","Tortillas",CK_RAYONS[4],"pc",8,"paquet de 8","paquets de 8",2.0],
 [/pita/i,"pita","Pains pita",CK_RAYONS[4],"pc",6,"paquet de 6","paquets de 6",1.8],
 [/baguette|\bpain\b|brioche|mie/i,"pain","Pain",CK_RAYONS[4],"pc",1,"","",1.2,250],
 [/cr[eè]me (fra[iî]che|[eé]paisse|aigre)|sour cream/i,"cremefr","Crème fraîche",CK_RAYONS[3],"g",200,"pot de 20 cl","pots de 20 cl",1.4],
 [/cr[eè]me(?! de coco| p[aâ]tiss| de marron)/i,"cremeliq","Crème liquide",CK_RAYONS[3],"ml",200,"brique de 20 cl","briques de 20 cl",1.2],
 [/mozzarella|burrata/i,"mozza","Mozzarella",CK_RAYONS[3],"g",125,"boule de 125 g","boules de 125 g",1.0],
 [/parmesan|parmigiano|grana|pecorino/i,"parmesan","Parmesan / pecorino",CK_RAYONS[3],"g",100,"morceau de 100 g","morceaux de 100 g",2.5],
 [/feta/i,"feta","Feta",CK_RAYONS[3],"g",200,"bloc de 200 g","blocs de 200 g",2.5],
 [/ricotta/i,"ricotta","Ricotta",CK_RAYONS[3],"g",250,"pot de 250 g","pots de 250 g",2.3],
 [/mascarpone/i,"mascarpone","Mascarpone",CK_RAYONS[3],"g",250,"pot de 250 g","pots de 250 g",2.5],
 [/emmental|gruy[eè]re|comt[eé]|r[aâ]p[eé]|cheddar|raclette|reblochon|ch[eè]vre|halloumi|paneer|gorgonzola|roquefort|fromage/i,"fromage","Fromage (râpé, comté, cheddar…)",CK_RAYONS[3],"g",200,"paquet de 200 g","paquets de 200 g",2.5],
 [/lardons?|pancetta|guanciale|bacon/i,"lardons","Lardons / pancetta",BOU,"g",200,"barquette de 200 g","barquettes de 200 g",2.2],
 [/jambon|prosciutto|chorizo|saucisson|salami/i,"jambon","Jambon / charcuterie",BOU,"g",160,"paquet (≈ 4 tranches)","paquets",2.5,40],
 [/saucisse|merguez/i,"saucisse","Saucisses",BOU,"pc",6,"paquet de 6","paquets de 6",4.0,70],
 [/poulet|volaille|dinde|pilon|cuisse/i,"poulet","Poulet",BOU,"g",500,"barquette de 500 g","barquettes de 500 g",5.5,150],
 [/hach[eé]/i,"hache","Viande hachée",BOU,"g",500,"barquette de 500 g","barquettes de 500 g",5.0],
 [/b[oœ]uf|steak|veau|bavette|paleron|joue/i,"boeuf","Bœuf / veau",BOU,"g",500,"barquette de 500 g","barquettes de 500 g",9.0,150],
 [/porc|travers|poitrine|ribs|filet mignon/i,"porc","Porc",BOU,"g",500,"barquette de 500 g","barquettes de 500 g",6.0,150],
 [/agneau|mouton/i,"agneau","Agneau",BOU,"g",500,"barquette de 500 g","barquettes de 500 g",12.0],
 [/canard|magret/i,"canard","Canard",BOU,"g",400,"pièce (≈ 400 g)","pièces",9.0,350],
 [/crevette|gambas/i,"crevettes","Crevettes",POI,"g",250,"barquette de 250 g","barquettes de 250 g",5.5,15],
 [/saumon/i,"saumon","Saumon",POI,"g",250,"lot de 2 pavés","lots de 2 pavés",6.0,125],
 [/thon/i,"thon","Thon",POI,"g",140,"boîte","boîtes",2.0],
 [/poisson|cabillaud|colin|dorade|\bbar\b|sole|lieu|merlu/i,"poisson","Poisson blanc",POI,"g",400,"portion de 400 g","portions de 400 g",7.0,150],
 [/moules?|palourdes?|coques?|vongole/i,"moules","Moules / palourdes",POI,"g",1000,"filet de 1 kg","filets de 1 kg",5.0],
 [/tofu/i,"tofu","Tofu",CK_RAYONS[3],"g",400,"bloc de 400 g","blocs de 400 g",2.5],
 [/chocolat/i,"chocolat","Chocolat",CK_RAYONS[4],"g",200,"tablette de 200 g","tablettes de 200 g",2.2],
 [/lait concentr/i,"laitconc","Lait concentré sucré",CK_RAYONS[4],"g",397,"boîte","boîtes",2.2],
 [/poudre d.amande|amandes? en poudre/i,"amandepoudre","Poudre d'amande",CK_RAYONS[4],"g",125,"sachet de 125 g","sachets de 125 g",2.5],
 [/amandes? (effil|enti|hach|grill|concass|mond)|^amandes?$/i,"amandes","Amandes",CK_RAYONS[4],"g",125,"sachet de 125 g","sachets de 125 g",2.5],
 [/pignon|pistache|noisette(?! de lait)|cerneaux|noix de p[eé]can/i,"fruitsecs","Fruits secs (pignons, pistaches, noisettes…)",CK_RAYONS[4],"g",100,"sachet de 100 g","sachets de 100 g",3.0],
 [/raisins? secs?|abricots? secs?|pruneaux|dattes s[eè]ches/i,"fruitssecs2","Fruits séchés",CK_RAYONS[4],"g",200,"sachet de 200 g","sachets",2.5],
 [/vin (blanc|rouge|ros[eé])|\bvin\b|porto|marsala|cognac|rhum|grand marnier|limoncello|bi[eè]re/i,"alcool","Vin / alcool de cuisine",CK_RAYONS[4],"ml",750,"bouteille","bouteilles",5.0],
 [/olives?/i,"olives","Olives",CK_RAYONS[4],"g",200,"bocal","bocaux",2.0],
 [/c[aâ]pres|cornichons?/i,"capres","Câpres / cornichons",CK_RAYONS[4],"g",100,"petit bocal","petits bocaux",1.8],
 [/miso|gochujang|doubanjiang|p[aâ]te de curry|tahin[ei]|pur[eé]e de s[eé]same|harissa/i,"pates_asie","Pâtes (miso, curry, tahini…)",CK_RAYONS[4],"g",200,"pot","pots",3.0],
];
const UNIT_MAP={"g":1,"ml":1,"c. à s.":15,"c. à c.":5,"poignée":30,"verre":200,"tasse":250,"bol":250,"cuillère":15,"pincée":0};
function buyHit(name){
  for(const e of BUY) if(e[0].test(name)) return e;
  const m=MAP.find(([re])=>re.test(name.toLowerCase()));
  if(m && m[1] && CAT[m[1]]) return CAT[m[1]][1]===PL ? [null,"placard"] : [null,"="+m[1]];
  return null;
}
// quantité de recette -> unité de base de l'article
function toBase(base, pack, pcW, p){
  if(!p) return pack*0.5; // « au goût » : on compte un demi-lot
  const {v,u}=p;
  if(u==="g"||u==="ml") return base==="pc" ? v/(pcW||100) : v;
  if(u in UNIT_MAP) { const g=v*UNIT_MAP[u]; return base==="pc" ? g/(pcW||100) : g; }
  if(/^(sachet|bo[iî]te|bocal|bocaux|paquet)/.test(u)) return v*pack;
  return base==="pc" ? v : v*(pcW||100); // pièces, gousses, tranches, bottes…
}
function packWord(e, n){ return e.w ? `${n} ${n>1?e.wp:e.w}` : `${n}`; }
function regionPrice(rayon, prix){ const m=REGIONS[state.region]?.mult||{}; return prix*(m[rayon] ?? m[CK_RAYONS[3]] ?? 1); }

// Liste fusionnée : shakies (catalogue Shakies) + plats (catalogue d'achat), un seul article par produit
function buildMerged(shPlan, ckPlan){
  const catNeed={}, buy={}, placard={}, other={};
  (shPlan||[]).forEach(id=>{ const n=needFor(id); for(const k in n) catNeed[k]=(catNeed[k]||0)+n[k]; });
  (ckPlan||[]).forEach(id=>{ const r=ckGet(id); if(!r) return;
    r.i.forEach(([item,q])=>{ const n=ckNormItem(item); if(!n || /^eau\b(?! de)/i.test(n)) return;
      const p=ckParseQty(q), hit=buyHit(n);
      if(!hit){ const k=n.toLowerCase(); (other[k]||(other[k]={nom:n,rayon:ckRayon(n)})); return; }
      if(hit[1]==="placard"){ placard[n.toLowerCase()]=n; return; }
      if(hit[1][0]==="="){ const k=hit[1].slice(1), c=CAT[k]; catNeed[k]=(catNeed[k]||0)+toBase(c[2]==="feuilles"?"pc":c[2], c[3], c[6]?c[6]:(c[2]==="pc"?null:150), p); return; }
      const [,key,nom,rayon,base,pack,w,wp,prix,pcW]=hit;
      const e=buy[key]||(buy[key]={key,nom,rayon,base,pack,w,wp,prix,pcW,need:0});
      e.need+=toBase(base,pack,pcW,p); }); });
  const items=[]; let total=0, lo=0, hi=0;
  for(const k in catNeed){ const c=cat(k);
    if(c.staple){ placard[c.nom.toLowerCase()]=c.nom; continue; }
    const packs=Math.max(1,Math.ceil(catNeed[k]/c.pack-0.05));
    const it={k,nom:c.nom,rayon:c.rayon,qty:`${packs} × ${c.label}`,cost:packs*c.prix,lo:packs*c.lo,hi:packs*c.hi,saison:c.saison,volatile:c.volatile};
    items.push(it); total+=it.cost; lo+=it.lo; hi+=it.hi; }
  for(const k in buy){ const e=buy[k], packs=Math.max(1,Math.ceil(e.need/e.pack-0.05)), cost=packs*regionPrice(e.rayon,e.prix);
    items.push({k:"b:"+k,nom:e.nom,rayon:e.rayon,qty:packWord(e,packs),cost,lo:cost,hi:cost}); total+=cost; lo+=cost; hi+=cost; }
  for(const k in other){ const e=other[k]; items.push({k:"o:"+k,nom:e.nom,rayon:e.rayon===CK_RAYONS[5]?CK_RAYONS[4]:e.rayon,qty:"",cost:null}); }
  const names=new Set(items.map(i=>i.nom.toLowerCase()));
  Object.values(placard).forEach(n=>{ if(!names.has(n.toLowerCase())){ names.add(n.toLowerCase()); items.push({k:"p:"+n.toLowerCase(),nom:n,rayon:CK_RAYONS[5],qty:"",cost:null,staple:true}); } });
  items.sort((a,b)=>a.nom.localeCompare(b.nom,"fr"));
  return {items,total,lo,hi,count:items.filter(i=>!i.staple).length,unknown:items.filter(i=>!i.staple&&i.cost==null).length};
}

// Plats au hasard qui réutilisent les ingrédients déjà prévus
function pickDishes(fixed, extra){
  const D=ckData(), plan=[...fixed], keys=new Set(plan.flatMap(id=>ckGet(id).i.map(x=>ckNormItem(x[0]).toLowerCase())));
  for(let n=0;n<extra;n++){
    const cand=D.filter(r=>!plan.includes(r.id)&&r.grp!=="sauce"&&r.grp!=="accomp").sort(()=>Math.random()-.5).slice(0,80)
      .map(r=>{ const its=r.i.map(x=>ckNormItem(x[0]).toLowerCase()); const shared=its.filter(k=>keys.has(k)).length;
        return [shared*2 - its.length*.35 + (r.di==="Rapide/Facile"?1:0) + Math.random()*1.5, r]; })
      .sort((a,b)=>b[0]-a[0]);
    if(!cand.length) break;
    const r=cand[Math.floor(Math.random()*Math.min(3,cand.length))][1];
    plan.push(r.id); r.i.forEach(x=>keys.add(ckNormItem(x[0]).toLowerCase()));
  }
  return plan;
}

/* ---------- Créer / modifier une recette Chef's Kiss ---------- */
const GRP_TY = {plat:"Meal", snack:"Snack", sucre:"Dessert", accomp:"Side", sauce:"Sauce"};
const GRP_CA = {plat:"Copieux", snack:"Fast Food", sucre:"Pâtisserie", accomp:"Healthy", sauce:"Healthy"};
const COOK_MODES = ["Four","Poêle & gril","Wok","Casserole","Mijoté","Vapeur","Friture","Sans cuisson","Mixeur"];
function ckNewDraft(){ return {n:"", grp:"plat", cu:"Français", di:"Rapide/Facile", p:15, c:20, m:"Poêle & gril", mr:"", op:false,
  i:[{item:"",q:""},{item:"",q:""},{item:"",q:""}], s:[""], src:"", photo:""}; }
function ckEditRecipe(id){
  const r=ckGet(id);
  state.ckdraft={id, n:r.n, grp:r.grp, cu:r.cu, di:r.di, p:r.p, c:r.cook, m:r.m, mr:r.mr, op:!!r.op,
    i:r.i.map(([item,q])=>({item,q})), s:[...r.s], src:r.src||"", photo:r.photo||"", builtin:!r.custom};
  state.from="all"; go("ckedit");
}
function ckEditorView(){
  const d=state.ckdraft, opt=(v,cur,lab)=>`<option value="${esc(v)}" ${v===cur?"selected":""}>${lab||v}</option>`;
  return `
  <div class="title"><h2>${d.id?"Modifier la recette":"Nouvelle recette"}</h2></div>
  ${d.builtin?`<p class="muted" style="font-size:.8rem;margin:0 0 10px">C'est une recette d'origine : tes changements sont enregistrés à part, tu pourras revenir à la version d'origine.</p>`:""}
  ${d.warn?`<div class="warn" style="margin-bottom:10px">${d.warn}</div>`:""}
  <div class="panel" style="margin-top:0">
    <label class="fl">Nom du plat<input data-ck="n" value="${esc(d.n)}" maxlength="80" placeholder="ex : Curry de pois chiches"></label>
    <div class="grid2">
      <label class="fl">Type<select class="tsel" data-ck="grp">${Object.entries(CK_GROUPS).map(([k,g])=>opt(k,d.grp,g[1]+" "+g[0])).join("")}</select></label>
      <label class="fl">Cuisine<select class="tsel" data-ck="cu">${Object.keys(CK_CUISINES).map(c=>opt(c,d.cu,CK_CUISINES[c].icon+" "+c)).join("")}</select></label>
      <label class="fl">Difficulté<select class="tsel" data-ck="di">${Object.entries(CK_DIFF).map(([k,v])=>opt(k,d.di,v.icon+" "+v.label)).join("")}</select></label>
      <label class="fl">Cuisson<select class="tsel" data-ck="m">${COOK_MODES.map(m=>opt(m,d.m,(CK_COOK[m]||"")+" "+m)).join("")}</select></label>
      <label class="fl">Préparation (min)<input data-ck="p" type="number" inputmode="numeric" min="0" value="${d.p}"></label>
      <label class="fl">Cuisson (min)<input data-ck="c" type="number" inputmode="numeric" min="0" value="${d.c}"></label>
    </div>
    <label class="fl">Précision sur la cuisson <span class="muted">(facultatif)</span><input data-ck="mr" value="${esc(d.mr)}" placeholder="ex : Four 180 °C, Cocotte, One pot…"></label>
  </div>
  <div class="panel">
    <h3>Ingrédients</h3>
    ${d.i.map((x,k)=>`<div class="irow ck"><input data-ckrow="${k}" data-k="q" value="${esc(x.q)}" placeholder="200 g"><input data-ckrow="${k}" data-k="item" value="${esc(x.item)}" placeholder="ex : pois chiches"><button data-ckdelrow="${k}" aria-label="Retirer">✕</button></div>`).join("")}
    <button class="pchip add" id="ckAddRow">＋ Ajouter un ingrédient</button>
  </div>
  <div class="panel">
    <h3>Étapes</h3>
    ${d.s.map((x,k)=>`<div class="srow"><span class="num">${k+1}</span><textarea data-ckstep="${k}" rows="2" placeholder="Décris l'étape…">${esc(x)}</textarea><button data-ckdelstep="${k}" aria-label="Retirer">✕</button></div>`).join("")}
    <button class="pchip add" id="ckAddStep">＋ Ajouter une étape</button>
  </div>
  <div class="panel">
    <h3>Photo <span class="muted" style="font:500 .75rem Inter">facultatif</span></h3>
    ${d.photo?`<img src="${d.photo}" alt="" style="width:100%;border-radius:16px;max-height:220px;object-fit:cover"><button class="pchip" id="ckDelPhoto" style="margin-top:6px">✕ Retirer la photo</button>`:""}
    <label class="pchip add" style="display:inline-block;margin-top:6px">📷 ${d.photo?"Changer":"Ajouter"} une photo<input type="file" accept="image/*" id="ckPhotoIn" hidden></label>
    <label class="fl">Lien de la vidéo <span class="muted">(facultatif)</span><input data-ck="src" value="${esc(d.src)}" placeholder="https://…"></label>
  </div>
  <div class="err" id="ckErr"></div>
  <button class="btn" id="ckSave" style="width:100%;margin-top:12px">💾 Enregistrer</button>`;
}
function ckFam(m){ return COOK_MODES.includes(m)?m:"Autre"; }
function ckSaveDraft(){
  const d=state.ckdraft, err=$("#ckErr"), cl=s=>String(s||"").replace(/[<>"&]/g,"").trim();
  if(!cl(d.n)) return err.textContent="Donne un nom au plat.";
  const i=d.i.filter(x=>cl(x.item)).map(x=>[cl(x.item), cl(x.q)||"au goût"]);
  if(i.length<1) return err.textContent="Ajoute au moins un ingrédient.";
  const s=d.s.map(cl).filter(Boolean);
  const raw={id:d.id||"ckperso-"+Date.now().toString(36), n:cl(d.n), ty:GRP_TY[d.grp], ca:GRP_CA[d.grp], grpSel:d.grp, cu:d.cu, di:d.di,
    p:+d.p||0, c:+d.c||0, mr:cl(d.mr)||d.m, m:ckFam(d.m), op:/one.?pot/i.test(d.mr)?1:0, i, s:s.length?s:["Voir la vidéo ou ajoute les étapes."],
    src:cl(d.src)||undefined, photo:d.photo||undefined};
  try{
    if(d.builtin){ const e=store.get("ckedits",{}); e[raw.id]=raw; localStorage.setItem("ckedits",JSON.stringify(e)); }
    else { const c=store.get("ckcustom",[]); const k=c.findIndex(x=>x.id===raw.id); if(k>=0) c[k]=raw; else c.push(raw); localStorage.setItem("ckcustom",JSON.stringify(c)); }
  }catch(e){ return err.textContent="Mémoire du téléphone pleine : essaie avec une photo plus petite ou sans photo."; }
  CKD=null; state.ckdraft=null; state.view="all"; open(raw.id);
}
function ckDeleteRecipe(id){
  const r=ckGet(id); if(!confirm(`Supprimer « ${r.n} » ? Cette action est définitive.`)) return;
  store.set("ckcustom", store.get("ckcustom",[]).filter(x=>x.id!==id)); favs.delete(id); store.set("favs",[...favs]);
  state.ckPick=(state.ckPick||[]).filter(x=>x!==id); store.set("ckpick",state.ckPick);
  if(state.ckRandom===id) state.ckRandom=null; CKD=null; go("all");
}
function ckRevert(id){ const e=store.get("ckedits",{}); delete e[id]; store.set("ckedits",e); CKD=null; render(); }
// photo choisie dans la galerie : réduite à 800 px pour tenir dans la mémoire de l'app
function ckLoadPhoto(file){
  const img=new Image(), url=URL.createObjectURL(file);
  img.onload=()=>{ const k=Math.min(1,800/Math.max(img.width,img.height)), c=document.createElement("canvas");
    c.width=Math.round(img.width*k); c.height=Math.round(img.height*k); c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    state.ckdraft.photo=c.toDataURL("image/jpeg",.72); URL.revokeObjectURL(url); const y=scrollY; render(); scrollTo(0,y); };
  img.src=url;
}

/* ---------- Importer une recette depuis TikTok / Instagram / Facebook / YouTube ---------- */
function platformOf(url){
  if(/tiktok\.com/i.test(url)) return "TikTok"; if(/instagram\.com/i.test(url)) return "Instagram";
  if(/facebook\.com|fb\.watch/i.test(url)) return "Facebook"; if(/youtube\.com|youtu\.be/i.test(url)) return "YouTube";
  return null;
}
const decodeHtml = s => { const t=document.createElement("textarea"); t.innerHTML=s; return t.value; };
const hasNativeFetch = () => !!(window.Android && typeof window.Android.fetchUrl === "function");
function nativeFetch(url){
  return new Promise(res=>{ const cb="__nf"+Date.now(); let done=false;
    window[cb]=html=>{ if(done) return; done=true; delete window[cb]; res(html); };
    try{ window.Android.fetchUrl(url, cb); }catch(e){ res(null); }
    setTimeout(()=>{ if(!done){ done=true; res(null); } },20000); });
}
// description depuis le HTML d'une page (lu par l'app Android, sans les blocages du navigateur)
function descFromHtml(html, platform){
  if(!html) return null;
  const meta = n => { const m=html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${n}["'][^>]*content=["']([^"']*)["']`,"i"))||html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${n}["']`,"i")); return m?decodeHtml(m[1]):""; };
  let text="", title=meta("og:title")||meta("title");
  if(platform==="YouTube"){ const m=html.match(/"shortDescription":"((?:\\.|[^"\\])*)"/); if(m) try{ text=JSON.parse('"'+m[1]+'"'); }catch(e){} }
  if(platform==="TikTok"){ const m=html.match(/"desc":"((?:\\.|[^"\\])*)"/); if(m) try{ text=JSON.parse('"'+m[1]+'"'); }catch(e){} }
  if(!text) text=meta("og:description")||meta("description");
  if(platform==="Instagram"){ const q=text.match(/:\s*["“](.*)["”]\s*\.?$/s); if(q) text=q[1]; }
  return {title, text};
}
async function readLink(url){
  const platform=platformOf(url);
  if(!platform) return {error:"Ce lien ne vient pas de TikTok, Instagram, Facebook ou YouTube."};
  let title="", text="", partial=false;
  if(platform==="TikTok"){
    try{ const j=await fetch("https://www.tiktok.com/oembed?url="+encodeURIComponent(url)).then(r=>r.json()); text=j.title||""; title=j.author_name?("Recette de "+j.author_name):""; }catch(e){}
  }
  if((!text || platform!=="TikTok") && hasNativeFetch()){
    const r=descFromHtml(await nativeFetch(url), platform); if(r){ text=r.text||text; title=r.title||title; }
  }
  if(!text && platform==="YouTube"){
    try{ const j=await fetch("https://www.youtube.com/oembed?format=json&url="+encodeURIComponent(url)).then(r=>r.json()); title=j.title||""; partial=true; }catch(e){}
  }
  return {platform, title, text, partial};
}
// analyse d'une description : titre, ingrédients, étapes
const QTY_RE = /^((?:\d+[.,/]?\d*|[½¼¾⅓⅔])(?:\s*(?:à|-|–)\s*\d+[.,]?\d*)?)\s*(kg|g|gr|grammes?|mg|l|cl|ml|dl|c\.?\s?à\s?s\.?|c\.?\s?à\s?c\.?|càs|cas|càc|cac|cs|cc|cuill[eè]res?(?: à (?:soupe|café))?|tbsp|tsp|tablespoons?|teaspoons?|cups?|tasses?|verres?|oz|lbs?|pinc[eé]es?|pinch|gousses?|cloves?|tranches?|slices?|bottes?|poign[eé]es?|sachets?|bo[iî]tes?|cans?|pi[eè]ces?|feuilles?)?\.?\s+(?:de\s+|d['’]\s*|of\s+)?(.+)$/i;
function cleanLine(s){ return s.replace(/^[\s\-–—•·*▪◾◽▫️✅✔☑️➡️👉🔸🔹⭐️🌟✨💛❤️🧡💚💙💜🖤🤍🥄🍴🔥📌📍👇]+/u,"").replace(/#[\p{L}\d_]+/gu,"").replace(/\s+/g," ").trim(); }
function parseRecipeText(raw, fallbackTitle){
  let lines=String(raw||"").split(/\r?\n|(?<=[.!?])\s+(?=\d+[.)]\s)/).map(s=>s.trim()).filter(Boolean);
  // listes écrites sur une ligne : « 1 cup mango, 1 banana, 1/2 cup oat milk »
  lines=lines.flatMap(l=>{
    if((l.match(/[,;]\s*(?:\d|[½¼¾])/g)||[]).length<2) return [l];
    const parts=l.split(/[,;]\s*(?=\d|[½¼¾])/), first=parts[0], k=first.search(/(?:^|\s)(?:\d+[.,/]?\d*|[½¼¾])\s*[a-zéèà.]*\s+\S/i);
    return (k>0 ? [first.slice(0,k).trim(), first.slice(k).trim()] : [first]).concat(parts.slice(1)).map(s=>s.trim()).filter(Boolean);
  });
  const ingHead=/^(ingr[ée]dients?|ingredients|what you('|’)ll need|you('|’)ll need|liste|pour \d+ (?:personnes|pers)|for \d+|serves \d+)\b/i;
  const stepHead=/^(pr[ée]paration|[ée]tapes?|instructions?|m[ée]thode|method|directions?|steps?|how to|recette|d[ée]roul[ée])\b/i;
  let mode=null; const ing=[], steps=[], other=[];
  for(const l0 of lines){
    const l=cleanLine(l0); if(!l) continue;
    if(ingHead.test(l)){ mode="ing"; const rest=l.replace(ingHead,"").replace(/\([^)]*\)/g,"").replace(/^[\s:–-]+|[\s:]+$/g,""); if(rest.length>2) ing.push(rest); continue; }
    if(stepHead.test(l) && l.length<40){ mode="step"; continue; }
    const numStep=/^\d+\s*[.)/-]\s+\S/.test(l0.trim()) && l.length>25;
    const looksIng=QTY_RE.test(l) && l.length<70;
    if(mode==="ing" && !numStep && l.length<90) ing.push(l);
    else if(mode==="step" || numStep) steps.push(l.replace(/^\d+\s*[.)/-]\s*/,""));
    else if(looksIng) ing.push(l);
    else other.push(l);
  }
  const title = (fallbackTitle && fallbackTitle.length<70 ? fallbackTitle : "") || (other[0]||"").replace(/[.!?].*$/,"").slice(0,60) || "Recette importée";
  const cut = s => s.split(/[.!?](?:\s|$)/)[0].trim(); // « 1 tbsp honey. Blend and enjoy » -> « honey »
  const parsed = ing.map(l=>{ const m=l.match(QTY_RE); return m ? {q:m[1]+(m[2]?" "+m[2]:""), item:cut(m[3]), qn:m[1], u:m[2]||""} : {q:"", item:cut(l), qn:"", u:""}; }).filter(x=>x.item);
  return {title:cleanLine(title), ing:parsed, steps, found: parsed.length>=2};
}
// conversion vers une recette Shakies
function toShakieUnit(qn,u){
  const s=String(qn).replace(",",".").replace("½","0.5").replace("¼","0.25").replace("¾","0.75").replace("⅓","0.33").replace("⅔","0.66");
  const fr=s.match(/^(\d+)\s*\/\s*(\d+)$/); let q=fr ? (+fr[1])/(+fr[2]) : (parseFloat(s)||1); u=(u||"").toLowerCase();
  if(/^(g|gr|gramm)/.test(u)) return [q,"g"]; if(u==="kg") return [q*1000,"g"]; if(u==="ml") return [q,"ml"]; if(u==="cl") return [q*10,"ml"]; if(u==="l") return [q*1000,"ml"];
  if(/cups?|tasses?/.test(u)) return [q*240,"ml"]; if(/verres?/.test(u)) return [q*200,"ml"]; if(/oz/.test(u)) return [q*28,"g"];
  if(/s\b|soupe|tbsp|tablespoon|cs|càs|cas/.test(u)) return [q,"c. à s."]; if(/c\b|café|tsp|teaspoon|cc|càc|cac/.test(u)) return [q,"c. à c."];
  if(/pinc|pinch/.test(u)) return [q,"pincée"]; if(/feuille/.test(u)) return [q,"feuilles"];
  return [q,""];
}
function viewImport(){
  const im=state.imp||(state.imp={url:"",text:"",target:state.univers==="chef"?"chef":"shakies",msg:"",busy:false});
  return `
  <div class="title"><h2>Importer une recette</h2></div>
  <div class="panel" style="margin-top:0">
    <p class="muted" style="font-size:.82rem;margin:0 0 8px">Colle le lien d'un reel ou d'un short <b>TikTok, Instagram, Facebook ou YouTube</b> : je lis la description et je prépare la recette.</p>
    <label class="fl">Lien de la vidéo<input id="impUrl" type="url" inputmode="url" value="${esc(im.url)}" placeholder="https://www.tiktok.com/@…/video/…"></label>
    <button class="btn" id="impRead" style="width:100%" ${im.busy?"disabled":""}>${im.busy?"⏳ Lecture…":"🔎 Lire la description"}</button>
    ${im.msg?`<div class="warn" style="margin-top:10px">${im.msg}</div>`:""}
    <label class="fl" style="margin-top:12px">Description <span class="muted">(remplie automatiquement, ou colle-la ici)</span>
      <textarea id="impText" rows="7" placeholder="Copie la description sous la vidéo et colle-la ici…">${esc(im.text)}</textarea></label>
    <div class="size" style="margin:8px 0"><button data-imptarget="shakies" class="${im.target==="shakies"?"on":""}">🥤 C'est un shakie</button><button data-imptarget="chef" class="${im.target==="chef"?"on":""}">🍽️ C'est un plat</button></div>
    <button class="btn" id="impGo" style="width:100%">✨ Créer la recette</button>
  </div>
  <p class="muted" style="font-size:.74rem">${hasNativeFetch()
    ? "L'app lit toute seule la description des vidéos <b>TikTok</b> et <b>YouTube</b>. Instagram et Facebook cachent la description aux applis : copie-la sous la vidéo et colle-la ici."
    : "Depuis le navigateur, les plateformes bloquent la lecture : copie la description sous la vidéo et colle-la ici. L'app Android 3.0 lit toute seule TikTok et YouTube."}
    Astuce${hasNativeFetch()?"":" (app Android)"} : dans TikTok, Instagram ou YouTube, touche « Partager » puis Shakies.</p>`;
}
async function impRead(){
  const im=state.imp; im.url=($("#impUrl")?.value||"").trim(); im.text=$("#impText")?.value||im.text;
  if(!im.url){ im.msg="Colle d'abord le lien de la vidéo."; return render(); }
  im.busy=true; im.msg=""; render();
  const r=await readLink(im.url); im.busy=false;
  if(r.error){ im.msg=r.error; return render(); }
  im.platform=r.platform; im.title=r.title;
  if(r.text){ im.text=r.text; const p=parseRecipeText(r.text, r.title);
    im.msg = p.found ? `✅ Description lue : ${p.ing.length} ingrédients${p.steps.length?` et ${p.steps.length} étapes`:""} trouvés. Vérifie, puis « Créer la recette ».`
      : `⚠️ <b>Il n'y a pas de recette dans la description</b> de cette vidéo. Tu vas devoir ajouter les ingrédients et les étapes <b>à la main</b> : touche « Créer la recette », le nom et le lien seront déjà remplis.`;
  } else im.msg = r.partial ? `⚠️ ${r.platform} ne laisse lire que le titre depuis ici (« ${esc(r.title)} »). Ouvre la vidéo, copie la description et colle-la ci-dessous.`
      : /Instagram|Facebook/.test(r.platform) ? `⚠️ ${r.platform} ne laisse pas les applis lire la description. Ouvre la vidéo, copie la description et colle-la ci-dessous.`
      : `⚠️ Impossible de lire la description sur ${r.platform}${hasNativeFetch()?" (vidéo privée ou supprimée ?)":" depuis le navigateur"}. Copie la description sous la vidéo et colle-la ci-dessous.`;
  render();
}
function impGo(){
  const im=state.imp; im.text=$("#impText")?.value||""; im.url=($("#impUrl")?.value||im.url).trim();
  const p=parseRecipeText(im.text, im.title||"");
  const warn = p.found ? "" : "⚠️ Pas de recette dans la description : ajoute les ingrédients et les étapes à la main.";
  if(!p.found && !confirm("Il n'y a pas de recette dans la description.\nTu vas devoir ajouter la recette manuellement. Continuer ?")) return;
  const title=p.title||"Recette importée";
  if(im.target==="shakies"){
    const d=newDraft(); d.nom=title.slice(0,40); d.src=im.url; d.desc=im.platform?`Recette trouvée sur ${im.platform}.`:"";
    if(p.found) d.ing=p.ing.map(x=>{ const [q,u]=toShakieUnit(x.qn,x.u); return {q,u,n:x.item}; });
    state.draft=d; state.univers="shakies"; store.set("univers","shakies"); state.from="all"; state.imp=null; go("create");
    if(warn){ const e=$("#formErr"); if(e) e.textContent=warn; }
  } else {
    const d=ckNewDraft(); d.n=title; d.src=im.url;
    if(p.found){ d.i=p.ing.map(x=>({item:x.item,q:x.q})); if(p.steps.length) d.s=p.steps; }
    d.warn=warn; state.ckdraft=d; state.univers="chef"; store.set("univers","chef"); state.from="all"; state.imp=null; go("ckedit");
  }
}
// texte partagé vers l'app depuis TikTok / Instagram / YouTube (APK) : on ouvre l'import
window.onSharedText = txt => {
  const url=(String(txt).match(/https?:\/\/\S+/)||[""])[0];
  state.imp={url, text:"", target:state.univers==="chef"?"chef":"shakies", msg:"", busy:false}; go("import");
  if(url) impRead();
};
