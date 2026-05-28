package edu.cit.bibit.skillconnect.features.main

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import edu.cit.bibit.skillconnect.R
import edu.cit.bibit.skillconnect.features.common.RetrofitClient
import edu.cit.bibit.skillconnect.features.common.SkillResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MarketplaceActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_marketplace)

        recyclerView = findViewById(R.id.rvMarketplace)
        progressBar = findViewById(R.id.pbLoading)
        recyclerView.layoutManager = LinearLayoutManager(this)

        findViewById<FloatingActionButton>(R.id.fabOfferSkill).setOnClickListener {
            startActivityForResult(Intent(this, OfferSkillActivity::class.java), 101)
        }

        loadMarketplacePostings()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 101 && resultCode == RESULT_OK) {
            loadMarketplacePostings()
        }
    }

    private fun loadMarketplacePostings() {
        progressBar.visibility = View.VISIBLE
        RetrofitClient.instance.getAllSkills().enqueue(object : Callback<List<SkillResponse>> {
            override fun onResponse(call: Call<List<SkillResponse>>, response: Response<List<SkillResponse>>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful && response.body() != null) {
                    recyclerView.adapter = SkillAdapter(response.body()!!) { selectedSkill ->
                        Toast.makeText(this@MarketplaceActivity, "Clicked: ${selectedSkill.title}", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@MarketplaceActivity, "Failed to resolve active listings", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<SkillResponse>>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@MarketplaceActivity, "Network handshake failure", Toast.LENGTH_SHORT).show()
            }
        })
    }
}