console.log("testoooo");

const width = 800;
const height = 700;

const svg = d3.select('body').append('svg')  
    .attr("width", width)
    .attr("height", height)
    .attr("stroke", "rgb(127, 127, 127)")
    .attr("stroke-width", "1px");


const projection = d3.geoAlbersUsa()
    .scale(2000)
    .translate([width*.9, height*.625]);

const path = d3.geoPath().projection(projection);

/* -----------------------------------------------------
 *  
 *  Plotting Garmin Data
 * 
 ----------------------------------------------------- */

d3.json("cdtInreachData.geojson").then(data => {
    const points = data.features.filter(d =>
      d.geometry?.type === "Point" &&
      Array.isArray(d.geometry.coordinates) &&
      d.geometry.coordinates.length === 2
    );
    const validPoints = points.filter(d => {
        const projected = projection(d.geometry.coordinates);
        return projected != null;
      });
  
    // Plot the points
    svg.selectAll(".points")
      .data(validPoints)
      .enter()
      .append("circle")
      .attr('class', 'points')
      .attr("cx", d => projection(d.geometry.coordinates)[0])
      .attr("cy", d => projection(d.geometry.coordinates)[1])
      .attr("r", 1.5)
      .attr('d', path)
      .attr("fill", "red")
      .attr("stroke", d => checkForCampsite(d))
      .attr("stroke-width", 1);

  });



  function checkForCampsite(data) {
    // Function to check if the data contains a campsite
    if (!data || !data.properties) {
        return false; // Invalid data
    }

    if (data.properties.MessageText.toLowerCase().includes("camped")){
        return "blue"
    }
    return "none"; // No campsite found
   
  }

/* -----------------------------------------------------
 *  
 *  State outline mapping functionality
 * 
 ----------------------------------------------------- */

  // geojson data from: https://github.com/johan/world.geo.json/tree/master
d3.json('CDTstates.json').then(data => {
    svg.selectAll('.state')
        .data(data.features)
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr("fill", "rgba(255, 255, 255, 0)")
        .attr("stroke", "rgb(127, 127, 127)")
        .attr("stroke-width", "1px")
        .attr('d', path)
        .on("click", clicked);
});  





/* -----------------------------------------------------
 *  
 *  Photo upload and display
 * 
 ----------------------------------------------------- */

 const imagePaths = [
"CDTvisPhotos/014934BC-66C4-4CAD-B91C-6FF34AF38601.jpg",
"CDTvisPhotos/01E85E57-A5E7-4F37-8A60-4F763585F30E.jpg",
"CDTvisPhotos/05D95CF0-1A88-4D89-9A20-4ED37BB70421.jpg",
"CDTvisPhotos/10C98EB4-9252-4C67-BE7B-735525D80F30.jpg",
"CDTvisPhotos/13EC5E4C-FB37-450C-BD2F-55B107725900.jpg",
"CDTvisPhotos/14B2080D-26F3-4F5F-A1AA-4D0C04D7ADC0.jpg",
"CDTvisPhotos/155AEDBE-927D-44BE-87C8-081816C3FDB9.jpg",
"CDTvisPhotos/15CD4575-933D-4969-A264-B7305C7B0C2A.jpg",
"CDTvisPhotos/189FE8FA-8F7A-4A78-B4B1-CE6C9418B38C.jpg",
"CDTvisPhotos/1F8DB2B9-6B8D-41D7-9B1F-4495DDE943EA.jpg",
"CDTvisPhotos/20AADE20-7E80-4082-B884-19D92C1A7D4E.jpg",
"CDTvisPhotos/2281f2ff-f8cd-4978-8fa4-ff0a2e39873b.jpg",
"CDTvisPhotos/246C6A72-17EC-47AD-84E2-B92E986DEB4A.jpg",
"CDTvisPhotos/334E4065-F90D-4D59-832B-3A5F71A5F10F.jpg",
"CDTvisPhotos/34b1bb0c-c90a-4cf4-8fe3-e8804a71c1db.jpg",
"CDTvisPhotos/36182AE2-11E9-449A-85C6-9C072261914C.jpg",
"CDTvisPhotos/3662C4B4-6B56-4FC5-9F40-719BC5029A39.jpg",
"CDTvisPhotos/3A21E159-DA61-4CF0-B1EE-96FA9ABD0D98.jpg",
"CDTvisPhotos/3EEA7026-5B88-4DE2-8B7C-2A4264EC0218.jpg",
"CDTvisPhotos/41C8C4D9-56E2-4F1E-A2C6-AD9AAF5E359B.jpg",
"CDTvisPhotos/4435FFB9-C73B-4C19-953C-086977920AD3.jpg",
"CDTvisPhotos/484007EF-BDC7-4A82-A492-82A26565E798.jpg",
"CDTvisPhotos/489F4BA0-1B98-41EB-BD24-AD53809300FB.jpg",
"CDTvisPhotos/499B0523-17EE-42FA-9D77-AE1C49390AC4.jpg",
"CDTvisPhotos/4ea6b09d-21c9-4b96-b455-2a1b9a05942c.jpg",
"CDTvisPhotos/59E665E0-5B69-4AC7-9C0C-B48308249BBD.jpg",
"CDTvisPhotos/5FBD0BF6-392C-4D7D-B56F-4CE50984DE11.jpg",
"CDTvisPhotos/6159012E-E89A-49F5-8BC0-CC35CE9724D0.jpg",
"CDTvisPhotos/61A01702-F319-40AB-A0F5-B70EC5BE4FEC.jpg",
"CDTvisPhotos/63115400-E295-48BA-B3D9-C6BEBCE58CD0.jpg",
"CDTvisPhotos/64C843CB-B340-4A4B-A977-AA2EFF706907.jpg",
"CDTvisPhotos/6f11a69e-037a-4ffd-b25d-9b4684462207.jpg",
"CDTvisPhotos/71293879-0847-4F39-B2BB-CFD878CB082F.jpg",
"CDTvisPhotos/74C825BD-89C2-4AB3-9CC0-0A89A7BC194C.jpg",
"CDTvisPhotos/7648034C-7481-426A-9837-E92942D55145.jpg",
"CDTvisPhotos/7BF22105-B78B-42B5-95EF-9B53389B2686.jpg",
"CDTvisPhotos/7E7EC7F5-169E-4127-A676-C087E6614FBB.jpg",
"CDTvisPhotos/85CFCCFF-6F8A-4B48-A666-12497E37B600.jpg",
"CDTvisPhotos/884D71D3-8BAD-4B0A-891B-88A6AEA3832A.jpg",
"CDTvisPhotos/89A621B4-75E7-451D-92D5-91AF22F6ECCF.jpg",
"CDTvisPhotos/8C5BE014-DA9F-47CF-8BBA-C2B8CD52ECA9.jpg",
"CDTvisPhotos/8D9EBD45-08D4-4513-8E7A-383A61B972CD.jpg",
"CDTvisPhotos/8E6B294C-0D59-41A5-8852-E8668FA47E7A.jpg",
"CDTvisPhotos/8cdf6032-87de-45e1-a137-f168911177e4.jpg",
"CDTvisPhotos/96509C80-6D56-46C3-AF3C-F451A4E468EF.jpg",
"CDTvisPhotos/A8D4539E-11E9-46A1-9D0F-98F86107048F.jpg",
"CDTvisPhotos/A92B43F3-78C2-4520-BA72-224BB27357F4.jpg",
"CDTvisPhotos/AA7954F3-7AA0-4434-B116-96F3FB716E20.jpg",
"CDTvisPhotos/AAF80D26-3F76-4F98-96DC-15B94805A3D4.jpg",
"CDTvisPhotos/BAA66A03-F50A-47AC-9968-C7A8F467C19D.jpg",
"CDTvisPhotos/C113B6C2-C1A8-482C-9247-5C391161CB79.jpg",
"CDTvisPhotos/C228607A-9372-4ABA-B56A-38BA3B2523F7.jpg",
"CDTvisPhotos/C304D999-E543-44B2-9B83-8F129FD5660A.jpg",
"CDTvisPhotos/C74719C3-628F-40D0-88AE-CBFD0AE0654D.jpg",
"CDTvisPhotos/C87A6CAB-99D3-4046-AA0B-53A820A12599.jpg",
"CDTvisPhotos/CB7BE29D-04C7-49EF-9303-D8D7C4E4EBD7.jpg",
"CDTvisPhotos/CD112C01-3734-43BF-8E1D-84786254740E.jpg",
"CDTvisPhotos/CE8FEE66-905F-43A3-99DC-C442FBCF12D5.jpg",
"CDTvisPhotos/D33ECBD9-FBDC-4671-AF9B-E2D308F4FD23.jpg",
"CDTvisPhotos/DE91E84C-DB7F-4196-A5D3-398A541B5DF4.jpg",
"CDTvisPhotos/E23FFFD8-D97A-4A8A-9287-2B0AB842F8AF.jpg",
"CDTvisPhotos/E76218DA-57EF-4771-8ECF-8F961CBC8A02.jpg",
"CDTvisPhotos/ED913D08-252C-42A8-B881-5CD8E41C4079.jpg",
"CDTvisPhotos/F3239B1C-2BA5-441A-A151-A29BD7027C5D.jpg",
"CDTvisPhotos/F6F49369-E99C-455A-B7CC-13850142BA15.jpg",
"CDTvisPhotos/FBA1F469-3914-4AFE-8A54-91B58F85689B.jpg",
// "CDTvisPhotos/IMG_2862.jpeg",
// "CDTvisPhotos/IMG_2863.jpeg",
// "CDTvisPhotos/IMG_2865.jpeg",
// "CDTvisPhotos/IMG_2882.jpeg",
// "CDTvisPhotos/IMG_2884.jpeg",
// "CDTvisPhotos/IMG_2899.jpeg",
// "CDTvisPhotos/IMG_2902.jpeg",
// "CDTvisPhotos/IMG_2904.jpeg",
// "CDTvisPhotos/IMG_2916.jpeg",
// "CDTvisPhotos/IMG_2922.jpeg",
// "CDTvisPhotos/IMG_2938.jpeg",
// "CDTvisPhotos/IMG_2946.jpeg",
// "CDTvisPhotos/IMG_2970.jpeg",
// "CDTvisPhotos/IMG_2973.jpeg",
// "CDTvisPhotos/IMG_2997.jpeg",
// "CDTvisPhotos/IMG_3007.jpeg",
// "CDTvisPhotos/IMG_3010.jpeg",
// "CDTvisPhotos/IMG_3016.jpeg",
// "CDTvisPhotos/IMG_3018.jpeg",
// "CDTvisPhotos/IMG_3033.jpeg",
// "CDTvisPhotos/IMG_3040.jpeg",
// "CDTvisPhotos/IMG_3043.jpeg",
// "CDTvisPhotos/IMG_3046.jpeg",
// "CDTvisPhotos/IMG_3047.jpeg",
// "CDTvisPhotos/IMG_3052.jpeg",
// "CDTvisPhotos/IMG_3063.jpeg",
// "CDTvisPhotos/IMG_3068.jpeg",
// "CDTvisPhotos/IMG_3071.jpeg",
// "CDTvisPhotos/IMG_3074.jpeg",
// "CDTvisPhotos/IMG_3075.jpeg",
// "CDTvisPhotos/IMG_3078.jpeg",
// "CDTvisPhotos/IMG_3079.jpeg",
// "CDTvisPhotos/IMG_3082.jpeg",
// "CDTvisPhotos/IMG_3086.jpeg",
// "CDTvisPhotos/IMG_3090.jpeg",
// "CDTvisPhotos/IMG_3099.jpeg",
// "CDTvisPhotos/IMG_3104.jpeg",
// "CDTvisPhotos/IMG_3113.jpeg",
// "CDTvisPhotos/IMG_3114.jpeg",
// "CDTvisPhotos/IMG_3119.jpeg",
// "CDTvisPhotos/IMG_3121.jpeg",
// "CDTvisPhotos/IMG_3125.jpeg",
// "CDTvisPhotos/IMG_3127.jpeg",
// "CDTvisPhotos/IMG_3131.jpeg",
// "CDTvisPhotos/IMG_3137.jpeg",
// "CDTvisPhotos/IMG_3140.jpeg",
// "CDTvisPhotos/IMG_3148.jpeg",
// "CDTvisPhotos/IMG_3149.jpeg",
// "CDTvisPhotos/IMG_3151.jpeg",
// "CDTvisPhotos/IMG_3155.jpeg",
// "CDTvisPhotos/IMG_3159.jpeg",
// "CDTvisPhotos/IMG_3160.JPG",
// "CDTvisPhotos/IMG_3160.jpeg",
// "CDTvisPhotos/IMG_3164.jpeg",
// "CDTvisPhotos/IMG_3171.jpeg",
// "CDTvisPhotos/IMG_3173.jpeg",
// "CDTvisPhotos/IMG_3178.jpeg",
// "CDTvisPhotos/IMG_3229.jpeg",
// "CDTvisPhotos/IMG_3231.jpeg",
// "CDTvisPhotos/IMG_3237.jpeg",
// "CDTvisPhotos/IMG_3238.jpeg",
// "CDTvisPhotos/IMG_3258.jpeg",
// "CDTvisPhotos/IMG_3259.jpeg",
// "CDTvisPhotos/IMG_3262.jpeg",
// "CDTvisPhotos/IMG_3272.jpeg",
// "CDTvisPhotos/IMG_3275.jpeg",
// "CDTvisPhotos/IMG_3277.jpeg",
// "CDTvisPhotos/IMG_3283.jpeg",
// "CDTvisPhotos/IMG_3286.jpeg",
// "CDTvisPhotos/IMG_3288.jpeg",
// "CDTvisPhotos/IMG_3292.jpeg",
// "CDTvisPhotos/IMG_3300.jpeg",
// "CDTvisPhotos/IMG_3305.jpeg",
// "CDTvisPhotos/IMG_3312.jpeg",
// "CDTvisPhotos/IMG_3320.jpeg",
// "CDTvisPhotos/IMG_3323.jpeg",
// "CDTvisPhotos/IMG_3324.jpeg",
// "CDTvisPhotos/IMG_3327.jpeg",
// "CDTvisPhotos/IMG_3328.jpeg",
// "CDTvisPhotos/IMG_3329.jpeg",
// "CDTvisPhotos/IMG_3331.jpeg",
// "CDTvisPhotos/IMG_3334.jpeg",
// "CDTvisPhotos/IMG_3339.jpeg",
// "CDTvisPhotos/IMG_3341.jpeg",
// "CDTvisPhotos/IMG_3343.jpeg",
// "CDTvisPhotos/IMG_3355.jpeg",
// "CDTvisPhotos/IMG_3358.jpeg",
// "CDTvisPhotos/IMG_3360.jpeg",
// "CDTvisPhotos/IMG_3369.jpeg",
// "CDTvisPhotos/IMG_3375.jpeg",
// "CDTvisPhotos/IMG_3446.jpeg",
// "CDTvisPhotos/IMG_3452.jpeg",
// "CDTvisPhotos/IMG_3454.jpeg",
// "CDTvisPhotos/IMG_3457.jpeg",
// "CDTvisPhotos/IMG_3471.jpeg",
// "CDTvisPhotos/IMG_3475.jpeg",
// "CDTvisPhotos/IMG_3485.jpeg",
// "CDTvisPhotos/IMG_3487.jpeg",
// "CDTvisPhotos/IMG_3506.jpeg",
// "CDTvisPhotos/IMG_3513.jpeg",
// "CDTvisPhotos/IMG_3518.jpeg",
// "CDTvisPhotos/IMG_3521.jpeg",
// "CDTvisPhotos/IMG_3525.jpeg",
// "CDTvisPhotos/IMG_3527.jpeg",
// "CDTvisPhotos/IMG_3528.jpeg",
// "CDTvisPhotos/IMG_3546.jpeg",
// "CDTvisPhotos/IMG_3548.jpeg",
// "CDTvisPhotos/IMG_3552.jpeg",
// "CDTvisPhotos/IMG_3554.jpeg",
// "CDTvisPhotos/IMG_3567.jpeg",
// "CDTvisPhotos/IMG_3610.jpeg",
// "CDTvisPhotos/IMG_3626.jpeg",
// "CDTvisPhotos/IMG_3629.jpeg",
// "CDTvisPhotos/IMG_3657.jpeg",
// "CDTvisPhotos/IMG_3661.jpeg",
// "CDTvisPhotos/IMG_3666.jpeg",
// "CDTvisPhotos/IMG_3668.jpeg",
// "CDTvisPhotos/IMG_3673.jpeg",
// "CDTvisPhotos/IMG_3677.jpeg",
// "CDTvisPhotos/IMG_3680.jpeg",
// "CDTvisPhotos/IMG_3693.jpeg",
// "CDTvisPhotos/IMG_3696.jpeg",
// "CDTvisPhotos/IMG_3697.jpeg",
// "CDTvisPhotos/IMG_3699.jpeg",
// "CDTvisPhotos/IMG_3702.jpeg",
// "CDTvisPhotos/IMG_3705.jpeg",
// "CDTvisPhotos/IMG_3709.jpeg",
// "CDTvisPhotos/IMG_3711.jpeg",
// "CDTvisPhotos/IMG_3715.jpeg",
// "CDTvisPhotos/IMG_3717.jpeg",
// "CDTvisPhotos/IMG_3719.jpeg",
// "CDTvisPhotos/IMG_3732.jpeg",
// "CDTvisPhotos/IMG_3734.jpeg",
// "CDTvisPhotos/IMG_3735.jpeg",
// "CDTvisPhotos/IMG_3739.jpeg",
// "CDTvisPhotos/IMG_3741.jpeg",
// "CDTvisPhotos/IMG_3746.jpeg",
// "CDTvisPhotos/IMG_3748.jpeg",
// "CDTvisPhotos/IMG_3750.jpeg",
// "CDTvisPhotos/IMG_3751.jpeg",
// "CDTvisPhotos/IMG_3752.jpeg",
// "CDTvisPhotos/IMG_3754.jpeg",
// "CDTvisPhotos/IMG_3756.jpeg",
// "CDTvisPhotos/IMG_3757.jpeg",
// "CDTvisPhotos/IMG_3758.jpeg",
// "CDTvisPhotos/IMG_3759.jpeg",
// "CDTvisPhotos/IMG_3779.jpeg",
// "CDTvisPhotos/IMG_3784.jpeg",
// "CDTvisPhotos/IMG_3800.jpeg",
// "CDTvisPhotos/IMG_3803.jpeg",
// "CDTvisPhotos/IMG_3805.jpeg",
// "CDTvisPhotos/IMG_3809.jpeg",
// "CDTvisPhotos/IMG_3812.jpeg",
// "CDTvisPhotos/IMG_3814.jpeg",
// "CDTvisPhotos/IMG_3817.jpeg",
// "CDTvisPhotos/IMG_3846.jpeg",
// "CDTvisPhotos/IMG_3849.jpeg",
// "CDTvisPhotos/IMG_3858.jpeg",
// "CDTvisPhotos/IMG_3863.jpeg",
// "CDTvisPhotos/IMG_3871.jpeg",
// "CDTvisPhotos/IMG_3874.jpeg",
// "CDTvisPhotos/IMG_3877.jpeg",
// "CDTvisPhotos/IMG_3880.jpeg",
// "CDTvisPhotos/IMG_3883.jpeg",
// "CDTvisPhotos/IMG_3885.jpeg",
// "CDTvisPhotos/IMG_3904.jpeg",
// "CDTvisPhotos/IMG_3906.jpeg",
// "CDTvisPhotos/IMG_3910.jpeg",
// "CDTvisPhotos/IMG_3912.jpeg",
// "CDTvisPhotos/IMG_3920.jpeg",
// "CDTvisPhotos/IMG_3923.jpeg",
// "CDTvisPhotos/IMG_3924.jpeg",
// "CDTvisPhotos/IMG_3927.jpeg",
// "CDTvisPhotos/IMG_3928.jpeg",
// "CDTvisPhotos/IMG_3931.jpeg",
// "CDTvisPhotos/IMG_3949.jpeg",
// "CDTvisPhotos/IMG_3966.jpeg",
// "CDTvisPhotos/IMG_3970.jpeg",
// "CDTvisPhotos/IMG_3971.jpeg",
// "CDTvisPhotos/IMG_3973.jpeg",
// "CDTvisPhotos/IMG_3975.jpeg",
// "CDTvisPhotos/IMG_3979.jpeg",
// "CDTvisPhotos/IMG_3982.jpeg",
// "CDTvisPhotos/IMG_3984.jpeg",
// "CDTvisPhotos/IMG_3988.jpeg",
// "CDTvisPhotos/IMG_3992.jpeg",
// "CDTvisPhotos/IMG_3997.jpeg",
// "CDTvisPhotos/IMG_3998.jpeg",
// "CDTvisPhotos/IMG_3999.jpeg",
// "CDTvisPhotos/IMG_4006.jpeg",
// "CDTvisPhotos/IMG_4013.jpeg",
// "CDTvisPhotos/IMG_4022.jpeg",
// "CDTvisPhotos/IMG_4024.jpeg",
// "CDTvisPhotos/IMG_4027.jpeg",
// "CDTvisPhotos/IMG_4040.jpeg",
// "CDTvisPhotos/IMG_4046.jpeg",
// "CDTvisPhotos/IMG_4050.jpeg",
// "CDTvisPhotos/IMG_4053.jpeg",
// "CDTvisPhotos/IMG_4056.jpeg",
// "CDTvisPhotos/IMG_4062.jpeg",
// "CDTvisPhotos/IMG_4063.jpeg",
// "CDTvisPhotos/IMG_4074.jpeg",
// "CDTvisPhotos/IMG_4078.jpeg",
// "CDTvisPhotos/IMG_4088.jpeg",
// "CDTvisPhotos/IMG_4093.jpeg",
// "CDTvisPhotos/IMG_4094.jpeg",
// "CDTvisPhotos/IMG_4099.jpeg",
// "CDTvisPhotos/IMG_4102.jpeg",
// "CDTvisPhotos/IMG_4109.jpeg",
// "CDTvisPhotos/IMG_4113.jpeg",
// "CDTvisPhotos/IMG_4118.jpeg",
// "CDTvisPhotos/IMG_4121.jpeg",
// "CDTvisPhotos/IMG_4129.jpeg",
// "CDTvisPhotos/IMG_4133.jpeg",
// "CDTvisPhotos/IMG_4134.jpeg",
// "CDTvisPhotos/IMG_4137.jpeg",
// "CDTvisPhotos/IMG_4139.jpeg",
// "CDTvisPhotos/IMG_4142.jpeg",
// "CDTvisPhotos/IMG_4144.jpeg",
// "CDTvisPhotos/IMG_4149.jpeg",
// "CDTvisPhotos/IMG_4155.jpeg",
// "CDTvisPhotos/IMG_4159.jpeg",
// "CDTvisPhotos/IMG_4163.jpeg",
// "CDTvisPhotos/IMG_4208.jpeg",
// "CDTvisPhotos/IMG_4211.jpeg",
// "CDTvisPhotos/IMG_4214.jpeg",
// "CDTvisPhotos/IMG_4233.jpeg",
// "CDTvisPhotos/IMG_4236.jpeg",
// "CDTvisPhotos/IMG_4240.jpeg",
// "CDTvisPhotos/IMG_4244.jpeg",
// "CDTvisPhotos/IMG_4254.jpeg",
// "CDTvisPhotos/IMG_4257.jpeg",
// "CDTvisPhotos/IMG_4266.jpeg",
// "CDTvisPhotos/IMG_4272.jpeg",
// "CDTvisPhotos/IMG_4274.jpeg",
// "CDTvisPhotos/IMG_4276.jpeg",
// "CDTvisPhotos/IMG_4277.jpeg",
// "CDTvisPhotos/IMG_4278.jpeg",
// "CDTvisPhotos/IMG_4281.jpeg",
// "CDTvisPhotos/IMG_4284.jpeg",
// "CDTvisPhotos/IMG_4285.jpeg",
// "CDTvisPhotos/IMG_4297.jpeg",
// "CDTvisPhotos/IMG_4311.jpeg",
// "CDTvisPhotos/IMG_4315.jpeg",
// "CDTvisPhotos/IMG_4317.jpeg",
// "CDTvisPhotos/IMG_4331.jpeg",
// "CDTvisPhotos/IMG_4334.jpeg",
// "CDTvisPhotos/IMG_4337.jpeg",
// "CDTvisPhotos/IMG_4341.jpeg",
// "CDTvisPhotos/IMG_4345.jpeg",
// "CDTvisPhotos/IMG_4348.jpeg",
// "CDTvisPhotos/IMG_4352.jpeg",
// "CDTvisPhotos/IMG_4358.jpeg",
// "CDTvisPhotos/IMG_4360.jpeg",
// "CDTvisPhotos/IMG_4373.jpeg",
// "CDTvisPhotos/IMG_4377.jpeg",
// "CDTvisPhotos/IMG_4379.jpeg",
// "CDTvisPhotos/IMG_4383.jpeg",
// "CDTvisPhotos/IMG_4384.jpeg",
// "CDTvisPhotos/IMG_4391.jpeg",
// "CDTvisPhotos/IMG_4393.jpeg",
// "CDTvisPhotos/IMG_4394.jpeg",
// "CDTvisPhotos/IMG_4396.jpeg",
// "CDTvisPhotos/IMG_4408.jpeg",
// "CDTvisPhotos/IMG_4409.jpeg",
// "CDTvisPhotos/IMG_4410.jpeg",
// "CDTvisPhotos/IMG_4416.jpeg",
// "CDTvisPhotos/IMG_4420.jpeg",
// "CDTvisPhotos/IMG_4425.jpeg",
// "CDTvisPhotos/IMG_4429.jpeg",
// "CDTvisPhotos/IMG_4430.jpeg",
// "CDTvisPhotos/IMG_4436.jpeg",
// "CDTvisPhotos/IMG_4438.jpeg",
// "CDTvisPhotos/IMG_4442.jpeg",
// "CDTvisPhotos/IMG_4447.jpeg",
// "CDTvisPhotos/IMG_4456.jpeg",
// "CDTvisPhotos/IMG_4459.jpeg",
// "CDTvisPhotos/IMG_4460.jpeg",
// "CDTvisPhotos/IMG_4462.jpeg",
// "CDTvisPhotos/IMG_4465.jpeg",
// "CDTvisPhotos/IMG_4503.jpeg",
// "CDTvisPhotos/IMG_4505.jpeg",
// "CDTvisPhotos/IMG_4515.jpeg",
// "CDTvisPhotos/IMG_4516.jpeg",
// "CDTvisPhotos/IMG_4522.jpeg",
// "CDTvisPhotos/IMG_4528.jpeg",
// "CDTvisPhotos/IMG_4530.jpeg",
// "CDTvisPhotos/IMG_4532.jpeg",
// "CDTvisPhotos/IMG_4542.jpeg",
// "CDTvisPhotos/IMG_4545.jpeg",
// "CDTvisPhotos/IMG_4553.jpeg",
// "CDTvisPhotos/IMG_4555.jpeg",
// "CDTvisPhotos/IMG_4559.jpeg",
// "CDTvisPhotos/IMG_4564.jpeg",
// "CDTvisPhotos/IMG_4568.jpeg",
// "CDTvisPhotos/IMG_4571.jpeg",
// "CDTvisPhotos/IMG_4573.jpeg",
// "CDTvisPhotos/IMG_4581.jpeg",
// "CDTvisPhotos/IMG_4582.jpeg",
// "CDTvisPhotos/IMG_4584.jpeg",
// "CDTvisPhotos/IMG_4594.jpeg",
// "CDTvisPhotos/IMG_4596.jpeg",
// "CDTvisPhotos/IMG_4605.jpeg",
// "CDTvisPhotos/IMG_4609.jpeg",
// "CDTvisPhotos/IMG_4611.jpeg",
// "CDTvisPhotos/IMG_4618.jpeg",
// "CDTvisPhotos/IMG_4620.jpeg",
// "CDTvisPhotos/IMG_4621.jpeg",
// "CDTvisPhotos/IMG_4628.jpeg",
// "CDTvisPhotos/IMG_4634.jpeg",
// "CDTvisPhotos/IMG_4639.jpeg",
// "CDTvisPhotos/IMG_4642.jpeg",
// "CDTvisPhotos/IMG_4646.jpeg",
// "CDTvisPhotos/IMG_4652.jpeg",
// "CDTvisPhotos/IMG_4658.jpeg",
// "CDTvisPhotos/IMG_4659.jpeg",
// "CDTvisPhotos/IMG_4666.jpeg",
// "CDTvisPhotos/IMG_4668.jpeg",
// "CDTvisPhotos/IMG_4672.jpeg",
// "CDTvisPhotos/IMG_4673.jpeg",
// "CDTvisPhotos/IMG_4680.jpeg",
// "CDTvisPhotos/IMG_4687.jpeg",
// "CDTvisPhotos/IMG_4688.jpeg",
// "CDTvisPhotos/IMG_4694.jpeg",
// "CDTvisPhotos/IMG_4698.jpeg",
// "CDTvisPhotos/IMG_4703.jpeg",
// "CDTvisPhotos/IMG_4706.jpeg",
// "CDTvisPhotos/IMG_4707.jpeg",
// "CDTvisPhotos/IMG_4708.jpeg",
// "CDTvisPhotos/IMG_4719.jpeg",
// "CDTvisPhotos/IMG_4731.jpeg",
// "CDTvisPhotos/IMG_4742.jpeg",
// "CDTvisPhotos/IMG_4747.jpeg",
// "CDTvisPhotos/IMG_4748.jpeg",
// "CDTvisPhotos/IMG_4753.jpeg",
// "CDTvisPhotos/IMG_4757.jpeg",
// "CDTvisPhotos/IMG_4770.jpeg",
// "CDTvisPhotos/IMG_4778.jpeg",
// "CDTvisPhotos/IMG_4783.jpeg",
// "CDTvisPhotos/IMG_4784.jpeg",
// "CDTvisPhotos/IMG_4794.jpeg",
// "CDTvisPhotos/IMG_4802.jpeg",
// "CDTvisPhotos/IMG_4805.jpeg",
// "CDTvisPhotos/IMG_4813.jpeg",
// "CDTvisPhotos/IMG_4819.jpeg",
// "CDTvisPhotos/IMG_4820.jpeg",
// "CDTvisPhotos/IMG_4824.jpeg",
// "CDTvisPhotos/IMG_4830.jpeg",
// "CDTvisPhotos/IMG_4833.jpeg",
// "CDTvisPhotos/IMG_4840.jpeg",
// "CDTvisPhotos/IMG_4846.jpeg",
// "CDTvisPhotos/IMG_4871.jpeg",
// "CDTvisPhotos/IMG_4883.jpeg",
// "CDTvisPhotos/IMG_4899.jpeg",
// "CDTvisPhotos/IMG_4903.jpeg",
// "CDTvisPhotos/IMG_4906.jpeg",
// "CDTvisPhotos/IMG_4910.jpeg",
// "CDTvisPhotos/IMG_4913.jpeg",
// "CDTvisPhotos/IMG_4927.jpeg",
// "CDTvisPhotos/IMG_4928.jpeg",
// "CDTvisPhotos/IMG_4930.jpeg",
// "CDTvisPhotos/IMG_4934.jpeg",
// "CDTvisPhotos/IMG_4941.jpeg",
// "CDTvisPhotos/IMG_4943.jpeg",
// "CDTvisPhotos/IMG_4951.jpeg",
// "CDTvisPhotos/IMG_4954.jpeg",
// "CDTvisPhotos/IMG_4959.jpeg",
// "CDTvisPhotos/IMG_4966.jpeg",
// "CDTvisPhotos/IMG_4971.jpeg",
// "CDTvisPhotos/IMG_4972.jpeg",
// "CDTvisPhotos/IMG_4973.jpeg",
// "CDTvisPhotos/IMG_4979.jpeg",
// "CDTvisPhotos/IMG_5049.jpeg",
// "CDTvisPhotos/IMG_5057.jpeg",
// "CDTvisPhotos/IMG_5059.jpeg",
// "CDTvisPhotos/IMG_5065.jpeg",
// "CDTvisPhotos/IMG_5074.jpeg",
// "CDTvisPhotos/IMG_5076.jpeg",
// "CDTvisPhotos/IMG_5082.jpeg",
// "CDTvisPhotos/IMG_5084.jpeg",
// "CDTvisPhotos/IMG_5087.jpeg",
// "CDTvisPhotos/IMG_5088.jpeg",
// "CDTvisPhotos/IMG_5098.jpeg",
// "CDTvisPhotos/IMG_5100.jpeg",
// "CDTvisPhotos/IMG_5102.jpeg",
// "CDTvisPhotos/IMG_5116.jpeg",
// "CDTvisPhotos/IMG_5121.jpeg",
// "CDTvisPhotos/IMG_5124.jpeg",
// "CDTvisPhotos/IMG_5127.jpeg",
// "CDTvisPhotos/IMG_5148.jpeg",
// "CDTvisPhotos/IMG_5180.jpeg",
// "CDTvisPhotos/IMG_5182.jpeg",
// "CDTvisPhotos/IMG_5189.jpeg",
// "CDTvisPhotos/IMG_5193.jpeg",
// "CDTvisPhotos/IMG_5196.jpeg",
// "CDTvisPhotos/IMG_5205.jpeg",
// "CDTvisPhotos/IMG_5213.jpeg",
// "CDTvisPhotos/IMG_5214.jpeg",
// "CDTvisPhotos/IMG_5218.jpeg",
// "CDTvisPhotos/IMG_5219.jpeg",
// "CDTvisPhotos/IMG_5227.jpeg",
// "CDTvisPhotos/IMG_5228.jpeg",
// "CDTvisPhotos/IMG_5231.jpeg",
// "CDTvisPhotos/IMG_5233.jpeg",
// "CDTvisPhotos/IMG_5236.jpeg",
// "CDTvisPhotos/IMG_5244.jpeg",
// "CDTvisPhotos/IMG_5246.jpeg",
// "CDTvisPhotos/IMG_5249.jpeg",
// "CDTvisPhotos/IMG_5258.jpeg",
// "CDTvisPhotos/IMG_5261.jpeg",
// "CDTvisPhotos/IMG_5267.jpeg",
// "CDTvisPhotos/IMG_5268.JPG",
// "CDTvisPhotos/IMG_5268.jpeg",
// "CDTvisPhotos/IMG_5271.jpeg",
// "CDTvisPhotos/IMG_5277.jpeg",
// "CDTvisPhotos/IMG_5279.jpeg",
// "CDTvisPhotos/IMG_5281.jpeg",
// "CDTvisPhotos/IMG_5285.jpeg",
// "CDTvisPhotos/IMG_5291.jpeg",
// "CDTvisPhotos/IMG_5292.jpeg",
// "CDTvisPhotos/IMG_5298.jpeg",
// "CDTvisPhotos/IMG_5299.jpeg",
// "CDTvisPhotos/IMG_5303.jpeg",
// "CDTvisPhotos/IMG_5304.jpeg",
// "CDTvisPhotos/IMG_5308.jpeg",
// "CDTvisPhotos/IMG_5341.jpeg",
// "CDTvisPhotos/IMG_5342.jpeg",
// "CDTvisPhotos/IMG_5344.jpeg",
// "CDTvisPhotos/IMG_5345.jpeg",
// "CDTvisPhotos/IMG_5346.jpeg",
// "CDTvisPhotos/IMG_5350.jpeg",
// "CDTvisPhotos/IMG_5351.jpeg",
// "CDTvisPhotos/IMG_5354.jpeg",
// "CDTvisPhotos/IMG_5355.jpeg",
// "CDTvisPhotos/IMG_5358.jpeg",
// "CDTvisPhotos/IMG_5362.jpeg",
// "CDTvisPhotos/IMG_5366.jpeg",
// "CDTvisPhotos/IMG_5369.jpeg",
// "CDTvisPhotos/IMG_5376.jpeg",
// "CDTvisPhotos/IMG_5377.jpeg",
// "CDTvisPhotos/IMG_5379.jpeg",
// "CDTvisPhotos/IMG_5381.jpeg",
// "CDTvisPhotos/IMG_5384.jpeg",
// "CDTvisPhotos/IMG_5388.jpeg",
// "CDTvisPhotos/IMG_5393.jpeg",
// "CDTvisPhotos/IMG_5399.jpeg",
// "CDTvisPhotos/IMG_5400.jpeg",
// "CDTvisPhotos/IMG_5401.jpeg",
// "CDTvisPhotos/IMG_5405.jpeg",
// "CDTvisPhotos/IMG_5406.jpeg",
// "CDTvisPhotos/IMG_5408.jpeg",
// "CDTvisPhotos/IMG_5409.jpeg",
// "CDTvisPhotos/IMG_5412.jpeg",
// "CDTvisPhotos/IMG_5416.jpeg",
// "CDTvisPhotos/IMG_5419.jpeg",
// "CDTvisPhotos/IMG_5421.jpeg",
// "CDTvisPhotos/IMG_5423.jpeg",
// "CDTvisPhotos/IMG_5425.jpeg",
// "CDTvisPhotos/IMG_5426.jpeg",
// "CDTvisPhotos/IMG_5428.jpeg",
// "CDTvisPhotos/IMG_5429.jpeg",
// "CDTvisPhotos/IMG_5430.jpeg",
// "CDTvisPhotos/IMG_5433.jpeg",
// "CDTvisPhotos/IMG_5435.jpeg",
// "CDTvisPhotos/IMG_5436.jpeg",
// "CDTvisPhotos/IMG_5438.jpeg",
// "CDTvisPhotos/IMG_5446.jpeg",
// "CDTvisPhotos/IMG_5448.jpeg",
// "CDTvisPhotos/IMG_5450.jpeg",
// "CDTvisPhotos/IMG_5453.jpeg",
// "CDTvisPhotos/IMG_5455.jpeg",
// "CDTvisPhotos/IMG_5456.jpeg",
// "CDTvisPhotos/IMG_5457.jpeg",
// "CDTvisPhotos/IMG_5460.jpeg",
// "CDTvisPhotos/IMG_5461.jpeg",
// "CDTvisPhotos/IMG_5464.jpeg",
// "CDTvisPhotos/IMG_5465.jpeg",
// "CDTvisPhotos/IMG_5467.jpeg",
// "CDTvisPhotos/IMG_5468.jpeg",
// "CDTvisPhotos/IMG_5469.jpeg",
// "CDTvisPhotos/IMG_5471.jpeg",
// "CDTvisPhotos/IMG_5475.jpeg",
// "CDTvisPhotos/IMG_5476.jpeg",
// "CDTvisPhotos/IMG_5478.jpeg",
// "CDTvisPhotos/IMG_5480.jpeg",
// "CDTvisPhotos/IMG_5483.jpeg",
// "CDTvisPhotos/IMG_5487.jpeg",
// "CDTvisPhotos/IMG_5490.jpeg",
// "CDTvisPhotos/IMG_5491.jpeg",
// "CDTvisPhotos/IMG_5501.jpeg",
// "CDTvisPhotos/IMG_5503.jpeg",
// "CDTvisPhotos/IMG_5505.jpeg",
// "CDTvisPhotos/IMG_5507.jpeg",
// "CDTvisPhotos/IMG_5509.jpeg",
// "CDTvisPhotos/IMG_5510.jpeg",
// "CDTvisPhotos/IMG_5513.jpeg",
// "CDTvisPhotos/IMG_5515.jpeg",
// "CDTvisPhotos/IMG_5516.jpeg",
// "CDTvisPhotos/IMG_5519.jpeg",
// "CDTvisPhotos/IMG_5522.jpeg",
// "CDTvisPhotos/IMG_5535.jpeg",
// "CDTvisPhotos/IMG_5536.jpeg",
// "CDTvisPhotos/IMG_5537.jpeg",
// "CDTvisPhotos/IMG_5542.jpeg",
// "CDTvisPhotos/IMG_5545.jpeg",
// "CDTvisPhotos/IMG_5546.jpeg",
// "CDTvisPhotos/IMG_5548.jpeg",
// "CDTvisPhotos/IMG_5551.jpeg",
// "CDTvisPhotos/IMG_5554.jpeg",
// "CDTvisPhotos/IMG_5557.jpeg",
// "CDTvisPhotos/IMG_5561.jpeg",
// "CDTvisPhotos/IMG_5566.jpeg",
// "CDTvisPhotos/IMG_5570.jpeg",
// "CDTvisPhotos/IMG_5572.jpeg",
// "CDTvisPhotos/IMG_5576.jpeg",
// "CDTvisPhotos/IMG_5578.jpeg",
// "CDTvisPhotos/IMG_5581.JPG",
// "CDTvisPhotos/IMG_5581.jpeg",
// "CDTvisPhotos/IMG_5588.jpeg",
// "CDTvisPhotos/IMG_5589.jpeg",
// "CDTvisPhotos/IMG_5594.jpeg",
// "CDTvisPhotos/IMG_5597.jpeg",
// "CDTvisPhotos/IMG_5598.jpeg",
// "CDTvisPhotos/IMG_5599.jpeg",
// "CDTvisPhotos/IMG_5600.jpeg",
// "CDTvisPhotos/IMG_5602.jpeg",
// "CDTvisPhotos/IMG_5605.jpeg",
// "CDTvisPhotos/IMG_5612.jpeg",
// "CDTvisPhotos/IMG_5618.jpeg",
// "CDTvisPhotos/IMG_5620.jpeg",
// "CDTvisPhotos/IMG_5621.jpeg",
// "CDTvisPhotos/IMG_5622.jpeg",
// "CDTvisPhotos/IMG_5624.jpeg",
// "CDTvisPhotos/IMG_5628.jpeg",
// "CDTvisPhotos/IMG_5631.jpeg",
// "CDTvisPhotos/IMG_5635.jpeg",
// "CDTvisPhotos/IMG_5640.jpeg",
// "CDTvisPhotos/IMG_5690.jpeg",
// "CDTvisPhotos/IMG_5696.jpeg",
// "CDTvisPhotos/IMG_5697.jpeg",
// "CDTvisPhotos/IMG_5699.jpeg",
// "CDTvisPhotos/IMG_5700.jpeg",
// "CDTvisPhotos/IMG_5701.jpeg",
// "CDTvisPhotos/IMG_5709.jpeg",
// "CDTvisPhotos/IMG_5712.jpeg",
// "CDTvisPhotos/IMG_5716.jpeg",
// "CDTvisPhotos/IMG_5722.jpeg",
// "CDTvisPhotos/IMG_5728.jpeg",
// "CDTvisPhotos/IMG_5731.jpeg",
// "CDTvisPhotos/IMG_5736.jpeg",
// "CDTvisPhotos/IMG_5747.jpeg",
// "CDTvisPhotos/IMG_5749.jpeg",
// "CDTvisPhotos/IMG_5752.jpeg",
// "CDTvisPhotos/IMG_5760.jpeg",
// "CDTvisPhotos/IMG_5762.jpeg",
// "CDTvisPhotos/IMG_5777.jpeg",
// "CDTvisPhotos/IMG_5784.jpeg",
// "CDTvisPhotos/IMG_5785.jpeg",
// "CDTvisPhotos/IMG_5788.jpeg",
// "CDTvisPhotos/IMG_5795.jpeg",
// "CDTvisPhotos/IMG_5796.jpeg",
// "CDTvisPhotos/IMG_5798.jpeg",
// "CDTvisPhotos/IMG_5799.jpeg",
// "CDTvisPhotos/IMG_5801.jpeg",
// "CDTvisPhotos/IMG_5804.jpeg",
// "CDTvisPhotos/IMG_5812.jpeg",
// "CDTvisPhotos/IMG_5816.jpeg",
// "CDTvisPhotos/IMG_5818.jpeg",
// "CDTvisPhotos/IMG_5820.jpeg",
// "CDTvisPhotos/IMG_5831.jpeg",
// "CDTvisPhotos/IMG_5835.jpeg",
// "CDTvisPhotos/IMG_5837.jpeg",
// "CDTvisPhotos/IMG_5841.jpeg",
// "CDTvisPhotos/IMG_5844.jpeg",
// "CDTvisPhotos/IMG_5846.jpeg",
// "CDTvisPhotos/IMG_5851.jpeg",
// "CDTvisPhotos/IMG_5852.jpeg",
// "CDTvisPhotos/IMG_5855.jpeg",
// "CDTvisPhotos/IMG_5858.jpeg",
// "CDTvisPhotos/IMG_5860.jpeg",
// "CDTvisPhotos/IMG_5862.jpeg",
// "CDTvisPhotos/IMG_5866.jpeg",
// "CDTvisPhotos/IMG_5871.jpeg",
// "CDTvisPhotos/IMG_5873.jpeg",
// "CDTvisPhotos/IMG_5875.jpeg",
// "CDTvisPhotos/IMG_5879.jpeg",
// "CDTvisPhotos/IMG_5881.jpeg",
// "CDTvisPhotos/IMG_5894.jpeg",
// "CDTvisPhotos/IMG_5897.jpeg",
// "CDTvisPhotos/IMG_5898.jpeg",
// "CDTvisPhotos/IMG_5900.jpeg",
// "CDTvisPhotos/IMG_5905.jpeg",
// "CDTvisPhotos/IMG_5907.jpeg",
// "CDTvisPhotos/IMG_5910.jpeg",
// "CDTvisPhotos/IMG_5913.jpeg",
// "CDTvisPhotos/IMG_5914.jpeg",
// "CDTvisPhotos/IMG_5922.jpeg",
// "CDTvisPhotos/IMG_5926.jpeg",
// "CDTvisPhotos/IMG_5927.jpeg",
// "CDTvisPhotos/IMG_5936.jpeg",
// "CDTvisPhotos/IMG_6002.jpeg",
// "CDTvisPhotos/IMG_6010.jpeg",
// "CDTvisPhotos/IMG_6012.heic",
// "CDTvisPhotos/IMG_6012.jpeg",
// "CDTvisPhotos/IMG_6015.jpeg",
// "CDTvisPhotos/IMG_6023.jpeg",
// "CDTvisPhotos/IMG_6025.jpeg",
// "CDTvisPhotos/IMG_6039.jpeg",
// "CDTvisPhotos/IMG_6049.jpeg",
// "CDTvisPhotos/IMG_6050.jpeg",
// "CDTvisPhotos/IMG_6051.jpeg",
// "CDTvisPhotos/IMG_6062.jpeg",
// "CDTvisPhotos/IMG_6066.jpeg",
// "CDTvisPhotos/IMG_6070.jpeg",
// "CDTvisPhotos/IMG_6073.jpeg",
// "CDTvisPhotos/IMG_6074.jpeg",
// "CDTvisPhotos/IMG_6079.jpeg",
// "CDTvisPhotos/IMG_6088.jpeg",
// "CDTvisPhotos/IMG_6094.jpeg",
// "CDTvisPhotos/IMG_6111.jpeg",
// "CDTvisPhotos/IMG_6113.jpeg",
// "CDTvisPhotos/IMG_6115.jpeg",
// "CDTvisPhotos/IMG_6122.jpeg",
// "CDTvisPhotos/IMG_6127.jpeg",
// "CDTvisPhotos/IMG_6129.heic",
// "CDTvisPhotos/IMG_6129.jpeg",
// "CDTvisPhotos/IMG_6130.jpeg",
// "CDTvisPhotos/IMG_6136.jpeg",
// "CDTvisPhotos/IMG_6139.jpeg",
// "CDTvisPhotos/IMG_6142.jpeg",
// "CDTvisPhotos/IMG_6146.jpeg",
// "CDTvisPhotos/IMG_6149.jpeg",
// "CDTvisPhotos/IMG_6150.jpeg",
// "CDTvisPhotos/IMG_6151.jpeg",
// "CDTvisPhotos/IMG_6154.jpeg",
// "CDTvisPhotos/IMG_6158.jpeg",
// "CDTvisPhotos/IMG_6159.jpeg",
// "CDTvisPhotos/IMG_6161.jpeg",
// "CDTvisPhotos/IMG_6164.jpeg",
// "CDTvisPhotos/IMG_6165.jpeg",
// "CDTvisPhotos/IMG_6167.jpeg",
// "CDTvisPhotos/IMG_6168.jpeg",
// "CDTvisPhotos/IMG_6170.jpeg",
// "CDTvisPhotos/IMG_6171.jpeg",
// "CDTvisPhotos/IMG_6179.jpeg",
// "CDTvisPhotos/IMG_6184.jpeg",
// "CDTvisPhotos/IMG_6196.jpeg",
// "CDTvisPhotos/IMG_6197.jpeg",
// "CDTvisPhotos/IMG_6203.jpeg",
// "CDTvisPhotos/IMG_6207.jpeg",
// "CDTvisPhotos/IMG_6211.jpeg",
// "CDTvisPhotos/IMG_6214.jpeg",
// "CDTvisPhotos/IMG_6216.jpeg",
// "CDTvisPhotos/IMG_6222.jpeg",
// "CDTvisPhotos/IMG_6226.jpeg",
// "CDTvisPhotos/IMG_6236.jpeg",
// "CDTvisPhotos/IMG_6241.jpeg",
// "CDTvisPhotos/IMG_6245.jpeg",
// "CDTvisPhotos/IMG_6246.jpeg",
// "CDTvisPhotos/IMG_6253.jpeg",
// "CDTvisPhotos/IMG_6255.jpeg",
// "CDTvisPhotos/IMG_6261.jpeg",
// "CDTvisPhotos/IMG_6267.jpeg",
// "CDTvisPhotos/IMG_6269.jpeg",
// "CDTvisPhotos/IMG_6273.jpeg",
// "CDTvisPhotos/IMG_6276.jpeg",
// "CDTvisPhotos/IMG_6281.jpeg",
// "CDTvisPhotos/IMG_6285.jpeg",
// "CDTvisPhotos/IMG_6288.jpeg",
// "CDTvisPhotos/IMG_6292.jpeg",
// "CDTvisPhotos/IMG_6298.jpeg",
// "CDTvisPhotos/IMG_6305.jpeg",
// "CDTvisPhotos/IMG_6308.jpeg",
// "CDTvisPhotos/IMG_6311.jpeg",
// "CDTvisPhotos/IMG_6314.jpeg",
// "CDTvisPhotos/IMG_6319.jpeg",
// "CDTvisPhotos/IMG_6329.jpeg",
// "CDTvisPhotos/IMG_6334.jpeg",
// "CDTvisPhotos/IMG_6336.jpeg",
// "CDTvisPhotos/IMG_6337.jpeg",
// "CDTvisPhotos/IMG_6340.jpeg",
// "CDTvisPhotos/IMG_6342.jpeg",
// "CDTvisPhotos/IMG_6347.jpeg",
// "CDTvisPhotos/IMG_6349.jpeg",
// "CDTvisPhotos/IMG_6350.jpeg",
// "CDTvisPhotos/IMG_6354.jpeg",
// "CDTvisPhotos/IMG_6355.jpeg",
// "CDTvisPhotos/IMG_6360.jpeg",
// "CDTvisPhotos/IMG_6361.jpeg",
// "CDTvisPhotos/IMG_6364.jpeg",
// "CDTvisPhotos/IMG_6368.jpeg",
// "CDTvisPhotos/IMG_6375.jpeg",
// "CDTvisPhotos/IMG_6379.jpeg",
// "CDTvisPhotos/IMG_6380.jpeg",
// "CDTvisPhotos/IMG_6382.jpeg",
// "CDTvisPhotos/IMG_6384.jpeg",
// "CDTvisPhotos/IMG_6390.jpeg",
// "CDTvisPhotos/IMG_6423.jpeg",
// "CDTvisPhotos/IMG_6428.jpeg",
// "CDTvisPhotos/IMG_6433.jpeg",
// "CDTvisPhotos/IMG_6435.jpeg",
// "CDTvisPhotos/IMG_6442.jpeg",
// "CDTvisPhotos/IMG_6444.jpeg",
// "CDTvisPhotos/IMG_6451.jpeg",
// "CDTvisPhotos/IMG_6452.jpeg",
// "CDTvisPhotos/IMG_6456.jpeg",
// "CDTvisPhotos/IMG_6458.jpeg",
// "CDTvisPhotos/IMG_6466.jpeg",
// "CDTvisPhotos/IMG_6470.jpeg",
// "CDTvisPhotos/IMG_6472.jpeg",
// "CDTvisPhotos/IMG_6475.jpeg",
// "CDTvisPhotos/IMG_6476.jpeg",
// "CDTvisPhotos/IMG_6479.jpeg",
// "CDTvisPhotos/IMG_6481.jpeg",
// "CDTvisPhotos/IMG_6482.jpeg",
// "CDTvisPhotos/IMG_6493.jpeg",
// "CDTvisPhotos/IMG_6496.jpeg",
// "CDTvisPhotos/IMG_6499.jpeg",
// "CDTvisPhotos/IMG_6508.jpeg",
// "CDTvisPhotos/IMG_6515.jpeg",
// "CDTvisPhotos/b017e02b-21a3-49af-aa4d-bb2009213df4.jpg",
// "CDTvisPhotos/e33ede71-1a41-4874-8462-f81a2cc92740.jpg",
// "CDTvisPhotos/e469a7cc-7c12-432f-b4aa-92a000750063.jpg",
// "CDTvisPhotos/f25335ae-43be-44fa-9496-38038211338c.jpg",
 ];

 async function loadPhotoMetadata(paths) {
    const geoPhotos = [];
  
    for (const path of paths) {
      try {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const tags = ExifReader.load(arrayBuffer); 
        const lat = tags.GPSLatitude?.description;
        const lon = tags.GPSLongitude?.description;
  
        if (lat && lon) {
            geoPhotos.push({
              path,
              latitude: lat,
              longitude: lon,
              previewUrl: path
            });
          } else {
            console.warn(`No GPS data found in ${path}`);
          }
      } catch (err) {
        console.error(`Error processing ${path}:`, err);
      }
    }
  
    console.log('Photos with GPS:', geoPhotos);
    plotPoints(geoPhotos); // Call your map plotting function
  }

  loadPhotoMetadata(imagePaths);


  function plotPoints(photoData) {


    const validPoints = photoData.filter(d => {
        const projected = projection([-d.longitude, d.latitude]);
        return projected != null;
      });
    console.log({photoData})
    console.log({validPoints})
    svg.selectAll(".photoPoints")
        .data(validPoints)
        .enter()
        .append("circle")
        .attr("class", "photoPoints")
        .attr("cx", d => projection([-d.longitude, d.latitude])[0])
        .attr("cy", d => projection([-d.longitude, d.latitude])[1])
        .attr("r", 4)
        .attr("fill", "green")  
        .on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseMove)
        .on("mouseout", handleMouseOut);
  }



  function handleMouseOver(event, d) {
    const tooltip = document.getElementById('tooltip');
  
    tooltip.innerHTML = `
      <img src="${d.previewUrl}" width="350">
    `;
    tooltip.style.display = 'block';
  }
  
  function handleMouseMove(event) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = event.pageX + 15 + 'px';
    tooltip.style.top = event.pageY - 50 + 'px';
  }
  
  function handleMouseOut() {
    document.getElementById('tooltip').style.display = 'none';
  }

/* -----------------------------------------------------
 *  
 *  Zoom and Pan functionality
 * 
 ----------------------------------------------------- */

// Define the zoom behavior
function clicked(event, d) {
    // Check if we’re already zoomed in on this state
    const [[x0, y0], [x1, y1]] = path.bounds(d);  // Get bounding box of the selected state
    const dx = x1 - x0;
    const dy = y1 - y0;
    const x = (x0 + x1) / 2;
    const y = (y0 + y1) / 2;
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    svg.transition()
        .duration(750)
        .call(
            zoom.transform,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
}


// Set up the zoom behavior
const zoom = d3.zoom()
    .scaleExtent([1, 8])  // Limits of the zoom scale
    .on("zoom", (event) => {
        svg.selectAll("circle").attr("transform", event.transform);  // Apply transform on zoom
        svg.selectAll("path").attr("transform", event.transform);  // Apply transform on zoom
        svg.selectAll("text").attr("transform", event.transform);  // Apply transform on zoom
        svg.selectAll("image").attr("transform", event.transform);  // Apply transform on zoom
    });

svg.call(zoom);


// Add background click to reset zoom
svg.on("click", (event) => {
    if (event.target.tagName !== "path") {  // Check if clicked outside a state
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);  // Reset zoom to initial state
    }
});



svg.append("circle").attr("cx",100).attr("cy",430).attr("r", 6).style("fill", "red")
svg.append("circle").attr("cx",100).attr("cy",460).attr("r", 6).style("fill", "blue")
svg.append("text").attr("x", 120).attr("y", 430).text("Garmin Message Sent").style("font-size", "15px").attr("alignment-baseline","middle").style("font-family", "Open Sans")
svg.append("text").attr("x", 120).attr("y", 460).text("Campsite Location").style("font-size", "15px").attr("alignment-baseline","middle").style("font-family", "Open Sans")




    
