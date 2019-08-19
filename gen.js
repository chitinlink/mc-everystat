/* eslint-disable no-console */

const
  fs = require("fs");

let out = "";

fs.readFile("./input/registries.json", (err, data) => {
  if (err) throw err;

  let
    reg      = JSON.parse(data),
    blocks   = Object.keys(reg["minecraft:block"]["entries"]),
    items    = Object.keys(reg["minecraft:block"]["entries"]),
    custom   = Object.keys(reg["minecraft:custom_stat"]["entries"]),
    entities = Object.keys(reg["minecraft:entity_type"]["entries"]),
    output_groups = {
      custom:    custom,
      broken:    items, // should actually only be items w durability
      used:      items, // a lot of items cannot be used
      crafted:   items, // only a (comparative) few items can be crafted
      mined:     blocks, // some blocks cannot be mined (air, bedrock)
      picked_up: items, // items includes blocks which cannot be obtained as items
      dropped:   items,
      killed:    entities, // a lot of entities that can't kill you probably
      killed_by: entities
    };


  Object.keys(output_groups).forEach(group => {
    output_groups[group].forEach(criteria => {
      criteria = criteria.substr(10); // remove "minecraft."

      let
        name_stat   = criteria.split("_").map(word => { return word.charAt(0).toUpperCase() + word.slice(1); }).join(""),
        name_human  = criteria.split("_").map(word => { return word.charAt(0).toUpperCase() + word.slice(1); }).join(" "),
        group_human = (group.charAt(0).toUpperCase() + group.slice(1)).replace("_", " ") + " ";

      if (group === "custom") group_human = "";

      out += `\nscoreboard objectives add stat_${group}_${name_stat} minecraft.${group}:minecraft.${criteria} "${group_human}${name_human}"`;
    });
  });

  out += `
scoreboard objectives add stat_deathCount deathCount "Deaths"
scoreboard objectives add stat_playerKillCount playerKillCount "Player Kills"
scoreboard objectives add stat_totalKillCount totalKillCount "Kills"
scoreboard objectives add stat_health health "HP"
scoreboard objectives add stat_xp xp "XP"
scoreboard objectives add stat_level level "Level"
scoreboard objectives add stat_food food "Food"
scoreboard objectives add stat_air air "Air"
scoreboard objectives add stat_armor armor "Armor"`;

  // TODO
  // check contents of ./ input/stats and generate commands to update the
  // scoreboard objectives to the existing player stats

  fs.writeFile("./output/data/everystat/functions/init.mcfunction", out, (err) => {
    if (err) throw err;
  });
});


