const cron = require("node-cron");
const Employee = require("./models/employee");
const bucket = require("./utils/storage"); 

cron.schedule("0 0 * * *", async () => {
    console.log("Resetting attendance and deleting old photos...");
  
    try {
      await Employee.update({ checkedIn: false, imgUrl: null }, { where: {} });
  
      const [files] = await bucket.getFiles({ prefix: "attendance/" });
      const deletePromises = files.map((file) => file.delete());
  
      await Promise.all(deletePromises);
      console.log("Deleted all attendance images from storage.");
  
    } catch (error) {
      console.error("Error resetting attendance:", error);
    }
});
